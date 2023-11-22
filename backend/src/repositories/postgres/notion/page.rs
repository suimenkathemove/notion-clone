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

impl From<Page> for models::notion::page::Page {
    fn from(value: Page) -> Self {
        Self {
            id: value.id.into(),
            title: value.title,
            text: value.text,
            created_at: value.created_at.into(),
            updated_at: value.updated_at.into(),
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

impl From<RepositoryPageTreePaths> for ModelsPageTreePaths {
    fn from(value: RepositoryPageTreePaths) -> Self {
        Self {
            ancestor: value.ancestor.into(),
            descendant: value.descendant.into(),
            weight: value.weight,
        }
    }
}

struct InternalPageRepository;

impl InternalPageRepository {
    async fn find_roots(
        conn: &mut PgConnection,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let pages = query_as::<_, Page>(
            "
            SELECT * FROM notion.pages WHERE id IN (
                SELECT descendant
                        FROM notion.page_tree_paths
                    GROUP BY descendant
                HAVING COUNT(*) = 1
            )
            ",
        )
        .fetch_all(&mut *conn)
        .await?;

        Ok(pages.into_iter().map(Into::into).collect())
    }

    async fn find_descendants(
        id: &models::notion::page::PageId,
        conn: &mut PgConnection,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let pages = query_as::<_, Page>(
            "
            SELECT * FROM notion.pages WHERE id IN (
                SELECT descendant FROM notion.page_tree_paths WHERE ancestor = $1 AND descendant <> $1
            )
            ",
        )
        .bind(id.0)
        .fetch_all(&mut *conn)
        .await?;

        Ok(pages.into_iter().map(Into::into).collect())
    }

    async fn find_ancestors(
        id: &models::notion::page::PageId,
        conn: &mut PgConnection,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let pages = query_as::<_, Page>(
            "
            SELECT *
            FROM notion.pages
            JOIN notion.page_tree_paths ON notion.pages.id = notion.page_tree_paths.ancestor
            WHERE notion.page_tree_paths.descendant = $1 AND notion.page_tree_paths.ancestor <> $1
            ORDER BY notion.page_tree_paths.weight DESC
            ",
        )
        .bind(id.0)
        .fetch_all(&mut *conn)
        .await?;

        Ok(pages.into_iter().map(Into::into).collect())
    }

    async fn find_children(
        id: &models::notion::page::PageId,
        conn: &mut PgConnection,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let pages = query_as::<_, Page>(
            "
            SELECT * FROM notion.pages WHERE id IN (
                SELECT descendant FROM notion.page_tree_paths WHERE ancestor = $1 AND weight = 1
            )
            ",
        )
        .bind(id.0)
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
        let page = query_as::<_, Page>(
            "INSERT INTO notion.pages (title, text) VALUES ($1, $2) RETURNING *",
        )
        .bind(title)
        .bind(text)
        .fetch_one(&mut *conn)
        .await?;

        query(
            "
            INSERT INTO notion.page_tree_paths (ancestor, descendant, weight)
                    SELECT ancestor, $2, weight + 1 FROM notion.page_tree_paths WHERE descendant = $1
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
            DELETE FROM notion.pages WHERE id IN (
                SELECT descendant FROM notion.page_tree_paths WHERE ancestor = $1
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
            DELETE FROM notion.page_tree_paths WHERE
                    descendant IN (SELECT descendant FROM notion.page_tree_paths WHERE ancestor = $1)
                AND
                    ancestor IN (SELECT ancestor FROM notion.page_tree_paths WHERE descendant = $1 AND ancestor != descendant)
            ",
        )
        .bind(id.0)
        .execute(&mut *conn)
        .await?;

        query(
            "
            INSERT INTO notion.page_tree_paths (ancestor, descendant, weight)
                SELECT supertree.ancestor, subtree.descendant, supertree.weight + subtree.weight + 1
                FROM notion.page_tree_paths AS supertree
                    CROSS JOIN notion.page_tree_paths AS subtree
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
    async fn find_roots(&self) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        let pages = InternalPageRepository::find_roots(&mut conn).await?;

        Ok(pages)
    }

    async fn find_descendants(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        let pages = InternalPageRepository::find_descendants(id, &mut conn).await?;

        Ok(pages)
    }

    async fn find_ancestors(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        let pages = InternalPageRepository::find_ancestors(id, &mut conn).await?;

        Ok(pages)
    }

    async fn find_children(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        let pages = InternalPageRepository::find_children(id, &mut conn).await?;

        Ok(pages)
    }

    async fn find_by_id(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<models::notion::page::Page, RepositoryError> {
        let page = query_as::<_, Page>("SELECT * FROM notion.pages WHERE id = $1")
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
    use sqlx::{Executor, Postgres, Transaction};
    use std::collections::{HashMap, HashSet};

    async fn setup<'a>(
    ) -> anyhow::Result<([models::notion::page::Page; 8], Transaction<'a, Postgres>)> {
        let mut tx = create_pool().await.begin().await?;

        let page_1 = InternalPageRepository::add(
            &None::<models::notion::page::PageId>,
            "1".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page_2 = InternalPageRepository::add(
            &None::<models::notion::page::PageId>,
            "2".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page_1_1 = InternalPageRepository::add(
            &Some(page_1.id),
            "1-1".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page_1_2 = InternalPageRepository::add(
            &Some(page_1.id),
            "1-2".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page_2_1 = InternalPageRepository::add(
            &Some(page_2.id),
            "2-1".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page_2_2 = InternalPageRepository::add(
            &Some(page_2.id),
            "2-2".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page_1_1_1 = InternalPageRepository::add(
            &Some(page_1_1.id),
            "1-1-1".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page_1_1_2 = InternalPageRepository::add(
            &Some(page_1_1.id),
            "1-1-2".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        Ok((
            [
                page_1, page_2, page_1_1, page_1_2, page_2_1, page_2_2, page_1_1_1, page_1_1_2,
            ],
            tx,
        ))
    }

    async fn teardown<'a>(tx: Transaction<'a, Postgres>) -> anyhow::Result<()> {
        tx.rollback().await?;

        Ok(())
    }

    async fn get_paths_map<'e, 'c: 'e, E>(
        executor: E,
    ) -> anyhow::Result<HashMap<models::notion::page::PageId, HashSet<models::notion::page::PageId>>>
    where
        E: 'e + Executor<'c, Database = Postgres>,
    {
        let paths = query_as::<_, RepositoryPageTreePaths>("SELECT * FROM notion.page_tree_paths")
            .fetch_all(executor)
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

        Ok(paths_map)
    }

    #[tokio::test]
    async fn find_roots_should_success() -> anyhow::Result<()> {
        let (
            [page_1, page_2, _page_1_1, _page_1_2, _page_2_1, _page_2_2, _page_1_1_1, _page_1_1_2],
            mut tx,
        ) = setup().await?;

        let roots = InternalPageRepository::find_roots(&mut tx).await?;
        assert_eq!(
            roots.into_iter().collect::<HashSet<_>>(),
            HashSet::from([page_1.clone(), page_2.clone()])
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn find_descendants_should_success() -> anyhow::Result<()> {
        let (
            [page_1, _page_2, page_1_1, page_1_2, _page_2_1, _page_2_2, page_1_1_1, page_1_1_2],
            mut tx,
        ) = setup().await?;

        let page_1_descendants =
            InternalPageRepository::find_descendants(&page_1.id, &mut tx).await?;
        assert_eq!(
            page_1_descendants.into_iter().collect::<HashSet<_>>(),
            HashSet::from([
                page_1_1.clone(),
                page_1_2.clone(),
                page_1_1_1.clone(),
                page_1_1_2.clone()
            ])
        );

        let page_1_1_descendants =
            InternalPageRepository::find_descendants(&page_1_1.id, &mut tx).await?;
        assert_eq!(
            page_1_1_descendants.into_iter().collect::<HashSet<_>>(),
            HashSet::from([page_1_1_1.clone(), page_1_1_2.clone()])
        );

        let page_1_1_1_descendants =
            InternalPageRepository::find_descendants(&page_1_1_1.id, &mut tx).await?;
        assert_eq!(
            page_1_1_1_descendants.into_iter().collect::<HashSet<_>>(),
            HashSet::from([])
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn find_ancestors_should_success() -> anyhow::Result<()> {
        let (
            [page_1, _page_2, page_1_1, _page_1_2, _page_2_1, _page_2_2, page_1_1_1, _page_1_1_2],
            mut tx,
        ) = setup().await?;

        let page_1_ancestors = InternalPageRepository::find_ancestors(&page_1.id, &mut tx).await?;
        assert_eq!(page_1_ancestors.into_iter().collect::<Vec<_>>(), vec![]);

        let page_1_1_ancestors =
            InternalPageRepository::find_ancestors(&page_1_1.id, &mut tx).await?;
        assert_eq!(
            page_1_1_ancestors.into_iter().collect::<Vec<_>>(),
            vec![page_1.clone()]
        );

        let page_1_1_1_ancestors =
            InternalPageRepository::find_ancestors(&page_1_1_1.id, &mut tx).await?;
        assert_eq!(
            page_1_1_1_ancestors.into_iter().collect::<Vec<_>>(),
            vec![page_1.clone(), page_1_1.clone()]
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn add_should_success() -> anyhow::Result<()> {
        let mut tx = create_pool().await.begin().await?;

        let page_1 = InternalPageRepository::add(
            &None::<models::notion::page::PageId>,
            "1".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page_1_1 = InternalPageRepository::add(
            &Some(page_1.id),
            "1-1".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let paths_map = get_paths_map(&mut tx).await?;

        assert_eq!(
            paths_map.get(&page_1.id).unwrap(),
            &HashSet::from([page_1.id.clone(), page_1_1.id.clone()])
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn remove_should_success() -> anyhow::Result<()> {
        let (
            [page_1, _page_2, page_1_1, page_1_2, _page_2_1, _page_2_2, _page_1_1_1, _page_1_1_2],
            mut tx,
        ) = setup().await?;

        InternalPageRepository::remove(&page_1_1.id, &mut tx).await?;

        let paths_map = get_paths_map(&mut tx).await?;

        assert_eq!(
            paths_map.get(&page_1.id).unwrap(),
            &HashSet::from([page_1.id.clone(), page_1_2.id.clone()])
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn move_should_success() -> anyhow::Result<()> {
        let (
            [_page_1, _page_2, page_1_1, page_1_2, _page_2_1, _page_2_2, page_1_1_1, page_1_1_2],
            mut tx,
        ) = setup().await?;

        InternalPageRepository::move_(&page_1_1.id, &page_1_2.id, &mut tx).await?;

        let paths_map = get_paths_map(&mut tx).await?;

        assert_eq!(
            paths_map.get(&page_1_2.id).unwrap(),
            &HashSet::from([
                page_1_2.id.clone(),
                page_1_1.id.clone(),
                page_1_1_1.id.clone(),
                page_1_1_2.id.clone()
            ])
        );

        teardown(tx).await?;

        Ok(())
    }
}
