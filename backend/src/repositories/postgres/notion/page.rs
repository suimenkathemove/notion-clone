use super::super::{
    super::{error::RepositoryError, interfaces::notion::page::IPageRepository},
    utils::DateTimeUtc,
};
use async_trait::async_trait;
use sqlx::{query, query_as, FromRow, PgConnection, PgPool};
use std::sync::Arc;

define_id!(PageId, models::notion::page::PageId);

#[derive(Debug, FromRow)]
pub struct Page {
    pub id: PageId,
    pub title: String,
    pub text: String,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

impl Into<models::notion::page::Page> for Page {
    fn into(self) -> models::notion::page::Page {
        models::notion::page::Page {
            id: self.id.into(),
            title: self.title,
            text: self.text,
            created_at: self.created_at.into(),
            updated_at: self.updated_at.into(),
        }
    }
}

#[derive(Debug)]
#[allow(dead_code)]
struct ModelsPageTreePaths {
    ancestor: models::notion::page::PageId,
    descendant: models::notion::page::PageId,
    // TODO: usize
    weight: i32,
}

#[derive(Debug, FromRow)]
struct RepositoryPageTreePaths {
    ancestor: PageId,
    descendant: PageId,
    // TODO: usize
    weight: i32,
}

impl Into<ModelsPageTreePaths> for RepositoryPageTreePaths {
    fn into(self) -> ModelsPageTreePaths {
        ModelsPageTreePaths {
            ancestor: self.ancestor.into(),
            descendant: self.descendant.into(),
            weight: self.weight,
        }
    }
}

struct InternalPageRepository;

impl InternalPageRepository {
    async fn find_descendants(
        parent_id: &models::notion::page::PageId,
        conn: &mut PgConnection,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let pages = query_as::<_, Page>(
            "
            SELECT * FROM pages WHERE id IN (
                SELECT descendant FROM page_tree_paths WHERE ancestor = $1 AND descendant <> $1
            )
            ",
        )
        .bind(parent_id.0)
        .fetch_all(&mut *conn)
        .await?;

        Ok(pages.into_iter().map(Into::into).collect())
    }

    async fn add(
        parent_id: &Option<models::notion::page::PageId>,
        title: String,
        text: String,
        conn: &mut PgConnection,
    ) -> Result<models::notion::page::Page, RepositoryError> {
        let page =
            query_as::<_, Page>("INSERT INTO pages (title, text) VALUES ($1, $2) RETURNING *")
                .bind(title)
                .bind(text)
                .fetch_one(&mut *conn)
                .await?;

        query(
            "
            INSERT INTO page_tree_paths (ancestor, descendant, weight)
                    SELECT ancestor, $2, weight + 1 FROM page_tree_paths WHERE descendant = $1
                UNION ALL
                    SELECT $2, $2, 0
            ",
        )
        .bind(parent_id.as_ref().map(|p| p.0))
        .bind(&page.id)
        .execute(&mut *conn)
        .await?;

        Ok(page.into())
    }

    async fn remove(
        id: &models::notion::page::PageId,
        conn: &mut PgConnection,
    ) -> Result<(), RepositoryError> {
        query(
            "
            DELETE FROM pages WHERE id IN (
                SELECT descendant FROM page_tree_paths WHERE ancestor = $1
            )
            ",
        )
        .bind(id.0)
        .execute(&mut *conn)
        .await?;

        Ok(())
    }

    async fn move_(
        id: &models::notion::page::PageId,
        to_parent_id: &models::notion::page::PageId,
        conn: &mut PgConnection,
    ) -> Result<(), RepositoryError> {
        query(
            "
            DELETE FROM page_tree_paths WHERE
                    descendant IN (SELECT descendant FROM page_tree_paths WHERE ancestor = $1)
                AND
                    ancestor IN (SELECT ancestor FROM page_tree_paths WHERE descendant = $1 AND ancestor != descendant)
            ",
        )
        .bind(id.0)
        .execute(&mut *conn)
        .await?;

        query(
            "
            INSERT INTO page_tree_paths (ancestor, descendant, weight)
                SELECT supertree.ancestor, subtree.descendant, supertree.weight + subtree.weight + 1
                FROM page_tree_paths AS supertree
                    CROSS JOIN page_tree_paths AS subtree
                WHERE supertree.descendant = $1
                    AND subtree.ancestor = $2
            ",
        )
        .bind(to_parent_id.0)
        .bind(id.0)
        .execute(&mut *conn)
        .await?;

        Ok(())
    }
}

pub struct PageRepository {
    pool: Arc<PgPool>,
}

impl PageRepository {
    pub fn new(pool: Arc<PgPool>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl IPageRepository for PageRepository {
    async fn find_list(&self) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let pages = query_as::<_, Page>("SELECT * FROM pages")
            .fetch_all(&*self.pool)
            .await?;

        Ok(pages.into_iter().map(Into::into).collect())
    }

    async fn find_descendants(
        &self,
        parent_id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        let pages = InternalPageRepository::find_descendants(parent_id, &mut conn).await?;

        Ok(pages)
    }

    async fn find_by_id(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<models::notion::page::Page, RepositoryError> {
        let page = query_as::<_, Page>("SELECT * FROM pages WHERE id = $1")
            .bind(id.0)
            .fetch_one(&*self.pool)
            .await?;

        Ok(page.into())
    }

    async fn add(
        &self,
        parent_id: &Option<models::notion::page::PageId>,
        title: String,
        text: String,
    ) -> Result<models::notion::page::Page, RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        let page = InternalPageRepository::add(parent_id, title, text, &mut conn).await?;

        Ok(page)
    }

    async fn remove(&self, id: &models::notion::page::PageId) -> Result<(), RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        InternalPageRepository::remove(id, &mut conn).await?;

        Ok(())
    }

    async fn move_(
        &self,
        id: &models::notion::page::PageId,
        to_parent_id: &models::notion::page::PageId,
    ) -> Result<(), RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        InternalPageRepository::move_(id, to_parent_id, &mut conn).await?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::{super::super::create_pool, *};
    use sqlx::{Postgres, Transaction};
    use std::collections::{HashMap, HashSet};

    async fn setup<'a>() -> anyhow::Result<(
        (
            models::notion::page::Page,
            models::notion::page::Page,
            models::notion::page::Page,
            models::notion::page::Page,
            models::notion::page::Page,
        ),
        Transaction<'a, Postgres>,
    )> {
        let mut tx = create_pool().await.begin().await?;

        let page1 = InternalPageRepository::add(
            &None::<models::notion::page::PageId>,
            "1".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page2 =
            InternalPageRepository::add(&Some(page1.id), "2".to_string(), "".to_string(), &mut tx)
                .await?;

        let page3 =
            InternalPageRepository::add(&Some(page1.id), "3".to_string(), "".to_string(), &mut tx)
                .await?;

        let page4 =
            InternalPageRepository::add(&Some(page2.id), "4".to_string(), "".to_string(), &mut tx)
                .await?;

        let page5 =
            InternalPageRepository::add(&Some(page2.id), "5".to_string(), "".to_string(), &mut tx)
                .await?;

        Ok(((page1, page2, page3, page4, page5), tx))
    }

    async fn teardown<'a>(tx: Transaction<'a, Postgres>) -> anyhow::Result<()> {
        tx.rollback().await?;

        Ok(())
    }

    #[tokio::test]
    async fn find_descendant_page_should_success() -> anyhow::Result<()> {
        let ((page1, page2, page3, page4, page5), mut tx) = setup().await?;

        let page1_descendants =
            InternalPageRepository::find_descendants(&page1.id, &mut tx).await?;
        assert_eq!(
            page1_descendants.into_iter().collect::<HashSet<_>>(),
            HashSet::from([page2.clone(), page3.clone(), page4.clone(), page5.clone()])
        );

        let page2_descendants =
            InternalPageRepository::find_descendants(&page2.id, &mut tx).await?;
        assert_eq!(
            page2_descendants.into_iter().collect::<HashSet<_>>(),
            HashSet::from([page4.clone(), page5.clone()])
        );

        let page3_descendants =
            InternalPageRepository::find_descendants(&page3.id, &mut tx).await?;
        assert_eq!(
            page3_descendants.into_iter().collect::<HashSet<_>>(),
            HashSet::from([])
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn add_page_should_success() -> anyhow::Result<()> {
        let ((page1, page2, page3, page4, page5), mut tx) = setup().await?;

        let paths = query_as::<_, RepositoryPageTreePaths>("SELECT * FROM page_tree_paths")
            .fetch_all(&mut tx)
            .await?
            .into_iter()
            .map(Into::into)
            .collect::<Vec<ModelsPageTreePaths>>();
        let paths_map = paths.iter().fold(HashMap::new(), |mut acc, paths| {
            acc.entry(paths.ancestor)
                .or_insert_with(HashSet::new)
                .insert(paths.descendant);
            acc
        });

        assert_eq!(
            paths_map.get(&page1.id).unwrap(),
            &HashSet::from([
                page1.id.clone(),
                page2.id.clone(),
                page3.id.clone(),
                page4.id.clone(),
                page5.id.clone()
            ])
        );
        assert_eq!(
            paths_map.get(&page2.id).unwrap(),
            &HashSet::from([page2.id.clone(), page4.id.clone(), page5.id.clone()])
        );
        assert_eq!(
            paths_map.get(&page3.id).unwrap(),
            &HashSet::from([page3.id.clone()])
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn remove_page_should_success() -> anyhow::Result<()> {
        let ((page1, page2, page3, _, _), mut tx) = setup().await?;

        InternalPageRepository::remove(&page2.id, &mut tx).await?;

        let pages = query_as::<_, Page>("SELECT * FROM pages")
            .fetch_all(&mut tx)
            .await?
            .into_iter()
            .map(Into::into)
            .collect::<Vec<models::notion::page::Page>>();
        assert_eq!(
            pages.into_iter().map(|p| p.id).collect::<HashSet<_>>(),
            HashSet::from([page1.id.clone(), page3.id.clone()])
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn move_page_should_success() -> anyhow::Result<()> {
        let ((page1, page2, page3, page4, page5), mut tx) = setup().await?;

        InternalPageRepository::move_(&page2.id, &page3.id, &mut tx).await?;

        let paths = query_as::<_, RepositoryPageTreePaths>("SELECT * FROM page_tree_paths")
            .fetch_all(&mut tx)
            .await?
            .into_iter()
            .map(Into::into)
            .collect::<Vec<ModelsPageTreePaths>>();

        {
            let path_1_1 = paths
                .iter()
                .find(|p| p.ancestor == page1.id && p.descendant == page1.id)
                .unwrap();
            assert_eq!(path_1_1.weight, 0);
        }
        {
            let path_1_3 = paths
                .iter()
                .find(|p| p.ancestor == page1.id && p.descendant == page3.id)
                .unwrap();
            assert_eq!(path_1_3.weight, 1);
        }
        {
            let path_1_2 = paths
                .iter()
                .find(|p| p.ancestor == page1.id && p.descendant == page2.id)
                .unwrap();
            assert_eq!(path_1_2.weight, 2);
        }
        {
            let path_1_4 = paths
                .iter()
                .find(|p| p.ancestor == page1.id && p.descendant == page4.id)
                .unwrap();
            assert_eq!(path_1_4.weight, 3);
        }
        {
            let path_1_5 = paths
                .iter()
                .find(|p| p.ancestor == page1.id && p.descendant == page5.id)
                .unwrap();
            assert_eq!(path_1_5.weight, 3);
        }

        {
            let path_3_3 = paths
                .iter()
                .find(|p| p.ancestor == page3.id && p.descendant == page3.id)
                .unwrap();
            assert_eq!(path_3_3.weight, 0);
        }
        {
            let path_3_2 = paths
                .iter()
                .find(|p| p.ancestor == page3.id && p.descendant == page2.id)
                .unwrap();
            assert_eq!(path_3_2.weight, 1);
        }
        {
            let path_3_4 = paths
                .iter()
                .find(|p| p.ancestor == page3.id && p.descendant == page4.id)
                .unwrap();
            assert_eq!(path_3_4.weight, 2);
        }
        {
            let path_3_5 = paths
                .iter()
                .find(|p| p.ancestor == page3.id && p.descendant == page5.id)
                .unwrap();
            assert_eq!(path_3_5.weight, 2);
        }

        {
            let path_2_2 = paths
                .iter()
                .find(|p| p.ancestor == page2.id && p.descendant == page2.id)
                .unwrap();
            assert_eq!(path_2_2.weight, 0);
        }
        {
            let path_2_4 = paths
                .iter()
                .find(|p| p.ancestor == page2.id && p.descendant == page4.id)
                .unwrap();
            assert_eq!(path_2_4.weight, 1);
        }
        {
            let path_2_5 = paths
                .iter()
                .find(|p| p.ancestor == page2.id && p.descendant == page5.id)
                .unwrap();
            assert_eq!(path_2_5.weight, 1);
        }

        {
            let path_4_4 = paths
                .iter()
                .find(|p| p.ancestor == page4.id && p.descendant == page4.id)
                .unwrap();
            assert_eq!(path_4_4.weight, 0);
        }

        {
            let path_5_5 = paths
                .iter()
                .find(|p| p.ancestor == page5.id && p.descendant == page5.id)
                .unwrap();
            assert_eq!(path_5_5.weight, 0);
        }

        teardown(tx).await?;

        Ok(())
    }
}
