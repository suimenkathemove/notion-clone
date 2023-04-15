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

        Ok(pages.into_iter().map(|p| p.into()).collect())
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

        Ok(page.into())
    }
}

#[cfg(test)]
mod tests {
    use super::{super::super::create_pool, *};
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

    #[tokio::test]
    async fn add_page_should_success() -> anyhow::Result<()> {
        let mut tx = create_pool().await.begin().await?;

        let page1 = InternalPageRepository::add(
            &None::<models::notion::page::PageId>,
            "".to_string(),
            "".to_string(),
            &mut tx,
        )
        .await?;

        let page2 =
            InternalPageRepository::add(&Some(page1.id), "".to_string(), "".to_string(), &mut tx)
                .await?;

        let page3 =
            InternalPageRepository::add(&Some(page2.id), "".to_string(), "".to_string(), &mut tx)
                .await?;

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
            paths_map.get(&page1.id).unwrap(),
            &HashSet::from([page1.id.clone(), page2.id.clone(), page3.id.clone()])
        );
        assert_eq!(
            paths_map.get(&page2.id).unwrap(),
            &HashSet::from([page2.id.clone(), page3.id.clone()])
        );
        assert_eq!(
            paths_map.get(&page3.id).unwrap(),
            &HashSet::from([page3.id.clone()])
        );

        tx.rollback().await?;

        Ok(())
    }
}
