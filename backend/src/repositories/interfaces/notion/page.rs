use super::super::super::error::RepositoryError;
use async_trait::async_trait;

#[async_trait]
pub trait IPageRepository: Send + Sync {
    async fn find_list(&self) -> Result<Vec<models::notion::page::Page>, RepositoryError>;

    async fn find_by_id(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<models::notion::page::Page, RepositoryError>;

    async fn add(
        &self,
        parent_id: &Option<models::notion::page::PageId>,
        title: String,
        text: String,
    ) -> Result<models::notion::page::Page, RepositoryError>;
}
