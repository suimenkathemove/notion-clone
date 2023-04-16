use super::super::{
    super::{error::RepositoryError, interfaces::notion::page::IPageRepository},
    utils::DateTimeUtc,
};
use async_trait::async_trait;
use sqlx::{query, query_as, FromRow, PgConnection, PgPool};
use std::sync::Arc;

define_id!(PageId, models::notion::page::PageId);

#[derive(FromRow)]
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
            INSERT INTO page_tree_paths (ancestor, descendant)
                    SELECT ancestor, $2 FROM page_tree_paths WHERE descendant = $1
                UNION ALL
                    SELECT $2, $2
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
}

#[cfg(test)]
mod tests {
    use super::{super::super::create_pool, *};
    use sqlx::{Postgres, Transaction};
    use std::collections::{HashMap, HashSet};

    struct ModelsPageTreePaths {
        ancestor: models::notion::page::PageId,
        descendant: models::notion::page::PageId,
    }

    #[derive(FromRow)]
    struct RepositoryPageTreePaths {
        ancestor: PageId,
        descendant: PageId,
    }

    impl Into<ModelsPageTreePaths> for RepositoryPageTreePaths {
        fn into(self) -> ModelsPageTreePaths {
            ModelsPageTreePaths {
                ancestor: self.ancestor.into(),
                descendant: self.descendant.into(),
            }
        }
    }

    async fn setup<'a>() -> anyhow::Result<(
        (
            models::notion::page::Page,
            models::notion::page::Page,
            models::notion::page::Page,
        ),
        Transaction<'a, Postgres>,
    )> {
        let mut tx = create_pool().await.begin().await?;

        let oneself = InternalPageRepository::add(
            &None::<models::notion::page::PageId>,
            "".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let child =
            InternalPageRepository::add(&Some(oneself.id), "".to_string(), "".to_string(), &mut tx)
                .await?;

        let grandchild =
            InternalPageRepository::add(&Some(child.id), "".to_string(), "".to_string(), &mut tx)
                .await?;

        Ok(((oneself, child, grandchild), tx))
    }

    async fn teardown<'a>(tx: Transaction<'a, Postgres>) -> anyhow::Result<()> {
        tx.rollback().await?;

        Ok(())
    }

    #[tokio::test]
    async fn find_descendant_page_should_success() -> anyhow::Result<()> {
        let ((oneself, child, grandchild), mut tx) = setup().await?;

        let oneself_descendants =
            InternalPageRepository::find_descendants(&oneself.id, &mut tx).await?;
        assert_eq!(
            oneself_descendants.into_iter().collect::<HashSet<_>>(),
            HashSet::from([child.clone(), grandchild.clone()])
        );

        let child_descendants =
            InternalPageRepository::find_descendants(&child.id, &mut tx).await?;
        assert_eq!(
            child_descendants.into_iter().collect::<HashSet<_>>(),
            HashSet::from([grandchild.clone()])
        );

        let grandchild_descendants =
            InternalPageRepository::find_descendants(&grandchild.id, &mut tx).await?;
        assert_eq!(
            grandchild_descendants.into_iter().collect::<HashSet<_>>(),
            HashSet::from([])
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn add_page_should_success() -> anyhow::Result<()> {
        let ((oneself, child, grandchild), mut tx) = setup().await?;

        let paths = query_as::<_, RepositoryPageTreePaths>(
            "SELECT ancestor, descendant FROM page_tree_paths",
        )
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
            paths_map.get(&oneself.id).unwrap(),
            &HashSet::from([oneself.id.clone(), child.id.clone(), grandchild.id.clone()])
        );
        assert_eq!(
            paths_map.get(&child.id).unwrap(),
            &HashSet::from([child.id.clone(), grandchild.id.clone()])
        );
        assert_eq!(
            paths_map.get(&grandchild.id).unwrap(),
            &HashSet::from([grandchild.id.clone()])
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn remove_page_should_success() -> anyhow::Result<()> {
        let ((oneself, _, _), mut tx) = setup().await?;

        InternalPageRepository::remove(&oneself.id, &mut tx).await?;

        let pages = query_as::<_, Page>("SELECT * FROM pages")
            .fetch_all(&mut tx)
            .await?
            .into_iter()
            .map(Into::into)
            .collect::<Vec<models::notion::page::Page>>();
        assert!(pages.is_empty());

        let paths = query_as::<_, RepositoryPageTreePaths>(
            "SELECT ancestor, descendant FROM page_tree_paths",
        )
        .fetch_all(&mut tx)
        .await?
        .into_iter()
        .map(Into::into)
        .collect::<Vec<ModelsPageTreePaths>>();
        assert!(paths.is_empty());

        teardown(tx).await?;

        Ok(())
    }
}
