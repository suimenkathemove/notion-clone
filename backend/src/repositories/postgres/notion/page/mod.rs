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
            WITH RECURSIVE descendant_relationships AS (
                SELECT ancestor, descendant, weight
                FROM notion.page_relationships
                WHERE ancestor = $1 AND weight = 1
                UNION ALL
                SELECT child.ancestor, child.descendant, child.weight
                FROM descendant_relationships
                JOIN notion.page_relationships AS child
                ON descendant_relationships.descendant = child.ancestor
                WHERE child.weight = 1
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
            SELECT descendant_relationships.ancestor, descendant_relationships.descendant, descendant_relationships.weight
            FROM descendant_relationships
            JOIN descendant_counts
            ON descendant_relationships.descendant = descendant_counts.descendant
            JOIN sibling_descendant_counts
            ON descendant_relationships.descendant = sibling_descendant_counts.descendant
            ORDER BY descendant_counts.count, sibling_descendant_counts.count
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

    async fn find_by_id(
        id: &models::notion::page::PageId,
        conn: &mut PgConnection,
    ) -> Result<models::notion::page::Page, RepositoryError> {
        let page = query_as::<_, Page>(
            "
            SELECT id, title, text, created_at, updated_at
            FROM notion.pages
            WHERE id = $1
            ",
        )
        .bind(id.0)
        .fetch_one(&mut *conn)
        .await?;

        Ok(page.into())
    }

    async fn add(
        parent_id: &Option<models::notion::page::PageId>,
        title: String,
        text: String,
        conn: &mut PgConnection,
    ) -> Result<models::notion::page::Page, RepositoryError> {
        let page = query_as::<_, Page>(
            "
            INSERT INTO notion.pages (title, text)
            VALUES ($1, $2)
            RETURNING id, title, text, created_at, updated_at
            ",
        )
        .bind(title)
        .bind(text)
        .fetch_one(&mut *conn)
        .await?;

        query(
            "
            INSERT INTO notion.page_relationships (ancestor, descendant, weight)
            SELECT ancestor, $2, weight + 1
            FROM notion.page_relationships
            WHERE descendant = $1
            UNION ALL
            SELECT $2, $2, 0
            ",
        )
        .bind(parent_id.as_ref().map(|p| p.0))
        .bind(&page.id)
        .execute(&mut *conn)
        .await?;

        let sibling_parent_id: Option<PageId> = match parent_id {
            Some(parent_id) => query_as::<_, Page>(
                "
                WITH children AS (
                    SELECT descendant AS id
                    FROM notion.page_relationships
                    WHERE ancestor = $1
                    AND weight = 1
                ),
                sibling_leaves AS (
                    SELECT ancestor AS id
                    FROM notion.page_sibling_relationships
                    GROUP BY ancestor
                    HAVING COUNT(*) = 1
                )
                SELECT notion.pages.id, title, text, created_at, updated_at
                FROM notion.pages
                JOIN children
                ON notion.pages.id = children.id
                JOIN sibling_leaves
                ON notion.pages.id = sibling_leaves.id
                ",
            )
            .bind(parent_id.0)
            .fetch_optional(&mut *conn)
            .await?
            .map(|p| p.id),
            None => query_as::<_, Page>(
                "
                WITH roots AS (
                    SELECT descendant AS id
                    FROM notion.page_relationships
                    GROUP BY descendant
                    HAVING COUNT(*) = 1
                ),
                sibling_leaves AS (
                    SELECT ancestor AS id
                    FROM notion.page_sibling_relationships
                    GROUP BY ancestor
                    HAVING COUNT(*) = 1
                )
                SELECT notion.pages.id, title, text, created_at, updated_at
                FROM notion.pages
                JOIN roots
                ON notion.pages.id = roots.id
                JOIN sibling_leaves
                ON notion.pages.id = sibling_leaves.id
                ",
            )
            .fetch_optional(&mut *conn)
            .await?
            .map(|p| p.id),
        };
        query(
            "
            INSERT INTO notion.page_sibling_relationships (ancestor, descendant, weight)
            SELECT ancestor, $2, weight + 1
            FROM notion.page_sibling_relationships
            WHERE descendant = $1
            UNION ALL
            SELECT $2, $2, 0
            ",
        )
        .bind(sibling_parent_id)
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
            DELETE FROM notion.pages
            WHERE id IN (
                SELECT descendant
                FROM notion.page_relationships
                WHERE ancestor = $1
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
        to_sibling_parent_id: &models::notion::page::PageId,
        conn: &mut PgConnection,
    ) -> Result<(), RepositoryError> {
        query(
            "
            DELETE FROM notion.page_relationships
            WHERE ancestor IN (
                SELECT ancestor
                FROM notion.page_relationships
                WHERE descendant = $1
                AND ancestor != $1
            )
            AND descendant IN (
                SELECT descendant
                FROM notion.page_relationships
                WHERE ancestor = $1
            )
            ",
        )
        .bind(id.0)
        .execute(&mut *conn)
        .await?;
        let to_parent_id = query_as::<_, Page>(
            "
            WITH parent AS (
                SELECT ancestor AS id
                FROM notion.page_relationships
                WHERE descendant = $1
                AND weight = 1
            )
            SELECT notion.pages.id, title, text, created_at, updated_at
            FROM notion.pages
            JOIN parent
            ON notion.pages.id = parent.id
            ",
        )
        .bind(to_sibling_parent_id.0)
        .fetch_optional(&mut *conn)
        .await?
        .map(|p| p.id);
        if let Some(to_parent_id) = to_parent_id {
            query(
                "
                INSERT INTO notion.page_relationships (ancestor, descendant, weight)
                SELECT parent.ancestor, child.descendant, parent.weight + child.weight + 1
                FROM notion.page_relationships AS parent
                JOIN notion.page_relationships AS child
                ON parent.descendant = $1
                AND child.ancestor = $2
                ",
            )
            .bind(to_parent_id)
            .bind(id.0)
            .execute(&mut *conn)
            .await?;
        }

        query(
            "
            DELETE FROM notion.page_sibling_relationships
            WHERE (ancestor = $1 OR descendant = $1)
            AND ancestor != descendant
            ",
        )
        .bind(id.0)
        .execute(&mut *conn)
        .await?;
        query(
            "
            INSERT INTO notion.page_sibling_relationships (ancestor, descendant, weight)
            SELECT ancestor, $2, weight + 1
            FROM notion.page_sibling_relationships
            WHERE descendant = $1
            ",
        )
        .bind(to_sibling_parent_id.0)
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
        let mut conn = self.pool.acquire().await?;
        let page = InternalPageRepository::find_by_id(id, &mut conn).await?;

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
        to_sibling_parent_id: &models::notion::page::PageId,
    ) -> Result<(), RepositoryError> {
        let mut conn = self.pool.acquire().await?;
        InternalPageRepository::move_(id, to_sibling_parent_id, &mut conn).await?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::{
        super::super::create_pool,
        mock::{insert_mock, InsertMockResponse},
        *,
    };
    use sqlx::{Executor, Postgres, Transaction};
    use std::collections::{HashMap, HashSet};

    async fn setup<'a>() -> anyhow::Result<(InsertMockResponse, Transaction<'a, Postgres>)> {
        let mut tx = create_pool().await.begin().await?;

        let insert_mock_response = insert_mock(&mut tx).await?;

        Ok((insert_mock_response, tx))
    }

    async fn teardown(tx: Transaction<'_, Postgres>) -> anyhow::Result<()> {
        tx.rollback().await?;

        Ok(())
    }

    async fn get_page_relationships_map<'e, 'c: 'e, E>(
        executor: E,
    ) -> anyhow::Result<HashMap<models::notion::page::PageId, HashSet<models::notion::page::PageId>>>
    where
        E: 'e + Executor<'c, Database = Postgres>,
    {
        let page_relationships =
            query_as::<_, PageRelationship>("SELECT * FROM notion.page_relationships")
                .fetch_all(executor)
                .await?
                .into_iter()
                .map(Into::into)
                .collect::<Vec<models::notion::page::PageRelationship>>();
        let page_relationships_map =
            page_relationships
                .iter()
                .fold(HashMap::new(), |mut acc, page_relationship| {
                    acc.entry(page_relationship.ancestor)
                        .or_insert_with(HashSet::new)
                        .insert(page_relationship.descendant);
                    acc
                });

        Ok(page_relationships_map)
    }

    async fn get_page_sibling_relationships_map<'e, 'c: 'e, E>(
        executor: E,
    ) -> anyhow::Result<HashMap<models::notion::page::PageId, HashSet<models::notion::page::PageId>>>
    where
        E: 'e + Executor<'c, Database = Postgres>,
    {
        let page_sibling_relationships =
            query_as::<_, PageRelationship>("SELECT * FROM notion.page_sibling_relationships")
                .fetch_all(executor)
                .await?
                .into_iter()
                .map(Into::into)
                .collect::<Vec<models::notion::page::PageRelationship>>();
        let page_sibling_relationships_map = page_sibling_relationships.iter().fold(
            HashMap::new(),
            |mut acc, page_sibling_relationship| {
                acc.entry(page_sibling_relationship.ancestor)
                    .or_insert_with(HashSet::new)
                    .insert(page_sibling_relationship.descendant);
                acc
            },
        );

        Ok(page_sibling_relationships_map)
    }

    #[tokio::test]
    async fn find_roots_should_success() -> anyhow::Result<()> {
        let (
            InsertMockResponse {
                page_1,
                page_2,
                page_3,
                page_1_1: _,
                page_1_2: _,
                page_1_3: _,
                page_1_1_1: _,
            },
            mut tx,
        ) = setup().await?;

        let pages = InternalPageRepository::find_roots(&mut tx).await?;
        assert_eq!(
            pages.into_iter().map(|p| p.id).collect::<Vec<_>>(),
            vec![page_1.id, page_2.id, page_3.id]
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn find_children_should_success() -> anyhow::Result<()> {
        let (
            InsertMockResponse {
                page_1,
                page_2: _,
                page_3: _,
                page_1_1,
                page_1_2,
                page_1_3,
                page_1_1_1: _,
            },
            mut tx,
        ) = setup().await?;

        let pages = InternalPageRepository::find_children(&page_1.id, &mut tx).await?;
        assert_eq!(
            pages.into_iter().map(|p| p.id).collect::<Vec<_>>(),
            vec![page_1_1.id, page_1_2.id, page_1_3.id]
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn find_ancestors_should_success() -> anyhow::Result<()> {
        let (
            InsertMockResponse {
                page_1,
                page_2: _,
                page_3: _,
                page_1_1,
                page_1_2: _,
                page_1_3: _,
                page_1_1_1,
            },
            mut tx,
        ) = setup().await?;

        let pages = InternalPageRepository::find_ancestors(&page_1_1_1.id, &mut tx).await?;
        assert_eq!(
            pages.into_iter().map(|p| p.id).collect::<Vec<_>>(),
            vec![page_1.id, page_1_1.id]
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn find_descendants_should_success() -> anyhow::Result<()> {
        let (
            InsertMockResponse {
                page_1,
                page_2: _,
                page_3: _,
                page_1_1,
                page_1_2,
                page_1_3,
                page_1_1_1,
            },
            mut tx,
        ) = setup().await?;

        let (pages, page_relationships) =
            InternalPageRepository::find_descendants(&page_1.id, &mut tx).await?;
        assert_eq!(
            pages.into_iter().map(|p| p.id).collect::<Vec<_>>(),
            vec![
                page_1.id,
                page_1_1.id,
                page_1_2.id,
                page_1_3.id,
                page_1_1_1.id,
            ]
        );
        assert_eq!(
            page_relationships.into_iter().collect::<Vec<_>>(),
            vec![
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
                    ancestor: page_1.id,
                    descendant: page_1_3.id,
                    weight: 1
                },
                models::notion::page::PageRelationship {
                    ancestor: page_1_1.id,
                    descendant: page_1_1_1.id,
                    weight: 1
                },
            ]
        );

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn add_should_success() -> anyhow::Result<()> {
        let (
            InsertMockResponse {
                page_1,
                page_2,
                page_3,
                page_1_1,
                page_1_2,
                page_1_3,
                page_1_1_1,
            },
            mut tx,
        ) = setup().await?;

        // TODO

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn remove_should_success() -> anyhow::Result<()> {
        let (
            InsertMockResponse {
                page_1,
                page_2,
                page_3,
                page_1_1,
                page_1_2,
                page_1_3,
                page_1_1_1,
            },
            mut tx,
        ) = setup().await?;

        InternalPageRepository::remove(&page_1_1.id, &mut tx).await?;

        // TODO

        teardown(tx).await?;

        Ok(())
    }

    #[tokio::test]
    async fn move_should_success() -> anyhow::Result<()> {
        let (
            InsertMockResponse {
                page_1,
                page_2,
                page_3,
                page_1_1,
                page_1_2,
                page_1_3,
                page_1_1_1,
            },
            mut tx,
        ) = setup().await?;

        InternalPageRepository::move_(&page_1_1.id, &page_1.id, &mut tx).await?;

        // TODO

        teardown(tx).await?;

        Ok(())
    }
}
