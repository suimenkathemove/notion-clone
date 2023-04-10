use super::super::{
    super::{error::RepositoryError, interfaces::notion::page::IPageRepository},
    utils::DateTimeUtc,
};
use async_trait::async_trait;
use sqlx::{query_as, FromRow, PgPool};
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

    async fn create(
        &self,
        title: String,
        text: String,
    ) -> Result<models::notion::page::Page, RepositoryError> {
        let page =
            query_as::<_, Page>("INSERT INTO pages (title, text) VALUES ($1, $2) RETURNING *")
                .bind(title)
                .bind(text)
                .fetch_one(&*self.pool)
                .await?;

        Ok(page.into())
    }
}
