use super::super::error::RepositoryError;
use async_trait::async_trait;

#[async_trait]
pub trait IPageRepository: Send + Sync {
    async fn find_roots(&self) -> Result<Vec<models::page::Page>, RepositoryError>;

    async fn find_children(
        &self,
        id: &models::page::PageId,
    ) -> Result<Vec<models::page::Page>, RepositoryError>;

    async fn find_ancestors(
        &self,
        id: &models::page::PageId,
    ) -> Result<Vec<models::page::Page>, RepositoryError>;

    async fn find_descendants(
        &self,
        id: &models::page::PageId,
    ) -> Result<(Vec<models::page::Page>, Vec<models::page::PageRelationship>), RepositoryError>;

    async fn find_by_id(
        &self,
        id: &models::page::PageId,
    ) -> Result<models::page::Page, RepositoryError>;

    async fn add(
        &self,
        parent_id: &Option<models::page::PageId>,
        add_page: models::page::AddPage,
    ) -> Result<models::page::Page, RepositoryError>;

    async fn update(
        &self,
        id: &models::page::PageId,
        update_page: models::page::UpdatePage,
    ) -> Result<models::page::Page, RepositoryError>;

    async fn remove(&self, id: &models::page::PageId) -> Result<(), RepositoryError>;

    async fn move_(
        &self,
        id: &models::page::PageId,
        target: &models::page::MoveTarget,
    ) -> Result<(), RepositoryError>;
}
