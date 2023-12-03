pub mod mock;

use super::super::{
    super::{error::RepositoryError, interfaces::notion::page::IPageRepository},
    common::DateTimeUtc,
};
use async_trait::async_trait;
use sqlx::{query, query_as, FromRow, PgConnection, PgPool};
use std::sync::Arc;

define_id!(PageId, models::notion::page::PageId);

#[derive(Debug, FromRow)]
struct Page {
    id: PageId,
    title: String,
    text: String,
    created_at: DateTimeUtc,
    updated_at: DateTimeUtc,
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

#[derive(Debug, FromRow)]
struct PageRelationship {
    ancestor: PageId,
    descendant: PageId,
    // TODO: usize
    weight: i32,
}

impl From<PageRelationship> for models::notion::page::PageRelationship {
    fn from(value: PageRelationship) -> Self {
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
            WITH roots AS (
                SELECT descendant AS id
                FROM notion.page_relationships
                GROUP BY descendant
                HAVING COUNT(*) = 1
            ),
            sibling_descendant_counts AS (
                SELECT descendant, COUNT(*) AS count
                FROM notion.page_sibling_relationships
                GROUP BY descendant
            )
            SELECT notion.pages.id, title, text, created_at, updated_at
            FROM notion.pages
            JOIN roots
            ON notion.pages.id = roots.id
            JOIN sibling_descendant_counts
            ON notion.pages.id = sibling_descendant_counts.descendant
            ORDER BY sibling_descendant_counts.count
            ",
        )
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
            WITH children AS (
                SELECT descendant AS id
                FROM notion.page_relationships
                WHERE ancestor = $1
                AND weight = 1
            ),
            sibling_descendant_counts AS (
                SELECT descendant, COUNT(*) AS count
                FROM notion.page_sibling_relationships
                GROUP BY descendant
            )
            SELECT notion.pages.id, title, text, created_at, updated_at
            FROM notion.pages
            JOIN children
            ON notion.pages.id = children.id
            JOIN sibling_descendant_counts
            ON notion.pages.id = sibling_descendant_counts.descendant
            ORDER BY sibling_descendant_counts.count
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
            SELECT id, title, text, created_at, updated_at
            FROM notion.pages
            JOIN notion.page_relationships
            ON notion.pages.id = notion.page_relationships.ancestor
            WHERE notion.page_relationships.descendant = $1
            AND notion.page_relationships.ancestor != $1
            ORDER BY notion.page_relationships.weight DESC
            ",
        )
        .bind(id.0)
        .fetch_all(&mut *conn)
        .await?;

        Ok(pages.into_iter().map(Into::into).collect())
    }

    async fn find_descendants(
        id: &models::notion::page::PageId,
        conn: &mut PgConnection,
    ) -> Result<
        (
            Vec<models::notion::page::Page>,
            Vec<models::notion::page::PageRelationship>,
        ),
        RepositoryError,
    > {
        let pages = query_as::<_, Page>(
            "
            WITH ancestors AS (
                SELECT id, title, text, created_at, updated_at
                FROM notion.pages
                WHERE id IN (
                    SELECT descendant
                    FROM notion.page_relationships
                    WHERE ancestor = $1
                )
            ),
            descendant_counts AS (
                SELECT descendant, COUNT(*) AS count
                FROM notion.page_relationships
                GROUP BY descendant
            ),
            sibling_descendant_counts AS (
                SELECT descendant, COUNT(*) AS count
                FROM notion.page_sibling_relationships
                GROUP BY descendant
            )
            SELECT id, title, text, created_at, updated_at
            FROM ancestors
            JOIN descendant_counts
            ON ancestors.id = descendant_counts.descendant
            JOIN sibling_descendant_counts
            ON ancestors.id = sibling_descendant_counts.descendant
            ORDER BY descendant_counts.count, sibling_descendant_counts.count
            ",
        )
        .bind(id.0)
        .fetch_all(&mut *conn)
        .await?;

        let page_relationships = query_as::<_, PageRelationship>(
            "
            WITH RECURSIVE descendants_page_relationships AS (
                SELECT ancestor, descendant, weight
                FROM notion.page_relationships
                WHERE ancestor = $1 AND weight = 1
                UNION ALL
                SELECT child.ancestor, child.descendant, child.weight
                FROM descendants_page_relationships
                JOIN notion.page_relationships AS child
                ON descendants_page_relationships.descendant = child.ancestor
                WHERE child.weight = 1
            )
            SELECT ancestor, descendant, weight
            FROM descendants_page_relationships
            ",
        )
        .bind(id.0)
        .fetch_all(&mut *conn)
        .await?;

        Ok((
            pages.into_iter().map(Into::into).collect(),
            page_relationships.into_iter().map(Into::into).collect(),
        ))
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
            INSERT INTO notion.page_relationships (ancestor, descendant, weight)
                    SELECT ancestor, $2, weight + 1 FROM notion.page_relationships WHERE descendant = $1
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
                SELECT descendant FROM notion.page_relationships WHERE ancestor = $1
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
            DELETE FROM notion.page_relationships WHERE
                    descendant IN (SELECT descendant FROM notion.page_relationships WHERE ancestor = $1)
                AND
                    ancestor IN (SELECT ancestor FROM notion.page_relationships WHERE descendant = $1 AND ancestor != descendant)
            ",
        )
        .bind(id.0)
        .execute(&mut *conn)
        .await?;

        query(
            "
            INSERT INTO notion.page_relationships (ancestor, descendant, weight)
                SELECT supertree.ancestor, subtree.descendant, supertree.weight + subtree.weight + 1
                FROM notion.page_relationships AS supertree
                    CROSS JOIN notion.page_relationships AS subtree
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

    async fn find_children(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        let pages = InternalPageRepository::find_children(id, &mut conn).await?;

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

    async fn find_descendants(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<
        (
            Vec<models::notion::page::Page>,
            Vec<models::notion::page::PageRelationship>,
        ),
        RepositoryError,
    > {
        let mut conn = self.pool.acquire().await?;
        let response = InternalPageRepository::find_descendants(id, &mut conn).await?;

        Ok(response)
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
    use super::{super::super::create_pool, mock::insert_mock, *};
    use sqlx::{Executor, Postgres, Transaction};
    use std::collections::{HashMap, HashSet};

    async fn setup<'a>(
    ) -> anyhow::Result<([models::notion::page::Page; 8], Transaction<'a, Postgres>)> {
        let mut tx = create_pool().await.begin().await?;

        let pages = insert_mock(&mut tx).await?;

        Ok((pages, tx))
    }

    async fn teardown(tx: Transaction<'_, Postgres>) -> anyhow::Result<()> {
        tx.rollback().await?;

        Ok(())
    }

    async fn get_paths_map<'e, 'c: 'e, E>(
        executor: E,
    ) -> anyhow::Result<HashMap<models::notion::page::PageId, HashSet<models::notion::page::PageId>>>
    where
        E: 'e + Executor<'c, Database = Postgres>,
    {
        let paths = query_as::<_, PageRelationship>("SELECT * FROM notion.page_relationships")
            .fetch_all(executor)
            .await?
            .into_iter()
            .map(Into::into)
            .collect::<Vec<models::notion::page::PageRelationship>>();
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
            roots.into_iter().map(|p| p.id).collect::<HashSet<_>>(),
            HashSet::from([page_1.id, page_2.id])
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
        assert_eq!(
            page_1_ancestors
                .into_iter()
                .map(|p| p.id)
                .collect::<Vec<_>>(),
            Vec::new()
        );

        let page_1_1_ancestors =
            InternalPageRepository::find_ancestors(&page_1_1.id, &mut tx).await?;
        assert_eq!(
            page_1_1_ancestors
                .into_iter()
                .map(|p| p.id)
                .collect::<Vec<_>>(),
            vec![page_1.id]
        );

        let page_1_1_1_ancestors =
            InternalPageRepository::find_ancestors(&page_1_1_1.id, &mut tx).await?;
        assert_eq!(
            page_1_1_1_ancestors
                .into_iter()
                .map(|p| p.id)
                .collect::<Vec<_>>(),
            vec![page_1.id, page_1_1.id]
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

        {
            let (pages, page_relationships) =
                InternalPageRepository::find_descendants(&page_1.id, &mut tx).await?;

            assert_eq!(
                pages.into_iter().map(|p| p.id).collect::<HashSet<_>>(),
                HashSet::from([
                    page_1.id,
                    page_1_1.id,
                    page_1_2.id,
                    page_1_1_1.id,
                    page_1_1_2.id
                ])
            );

            assert_eq!(
                page_relationships.into_iter().collect::<HashSet<_>>(),
                HashSet::from([
                    models::notion::page::PageRelationship {
                        ancestor: page_1.id,
                        descendant: page_1_1.id,
                        weight: 1
                    },
                    models::notion::page::PageRelationship {
                        ancestor: page_1.id,
                        descendant: page_1_2.id,
                        weight: 1
                    },
                    models::notion::page::PageRelationship {
                        ancestor: page_1_1.id,
                        descendant: page_1_1_1.id,
                        weight: 1
                    },
                    models::notion::page::PageRelationship {
                        ancestor: page_1_1.id,
                        descendant: page_1_1_2.id,
                        weight: 1
                    }
                ])
            )
        }

        {
            let (pages, page_relationships) =
                InternalPageRepository::find_descendants(&page_1_1.id, &mut tx).await?;

            assert_eq!(
                pages.into_iter().map(|p| p.id).collect::<HashSet<_>>(),
                HashSet::from([page_1_1.id, page_1_1_1.id, page_1_1_2.id])
            );

            assert_eq!(
                page_relationships.into_iter().collect::<HashSet<_>>(),
                HashSet::from([
                    models::notion::page::PageRelationship {
                        ancestor: page_1_1.id,
                        descendant: page_1_1_1.id,
                        weight: 1
                    },
                    models::notion::page::PageRelationship {
                        ancestor: page_1_1.id,
                        descendant: page_1_1_2.id,
                        weight: 1
                    }
                ])
            )
        }

        {
            let (pages, page_relationships) =
                InternalPageRepository::find_descendants(&page_1_1_1.id, &mut tx).await?;

            assert_eq!(
                pages.into_iter().map(|p| p.id).collect::<HashSet<_>>(),
                HashSet::from([page_1_1_1.id])
            );

            assert_eq!(
                page_relationships.into_iter().collect::<HashSet<_>>(),
                HashSet::new()
            )
        }

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
            &HashSet::from([page_1.id, page_1_1.id])
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
            &HashSet::from([page_1.id, page_1_2.id])
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
            &HashSet::from([page_1_2.id, page_1_1.id, page_1_1_1.id, page_1_1_2.id])
        );

        teardown(tx).await?;

        Ok(())
    }
}
