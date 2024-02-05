use super::super::super::error::RepositoryError;
use async_trait::async_trait;

#[async_trait]
pub trait IPageRepository: Send + Sync {
    async fn find_roots(&self) -> Result<Vec<models::notion::page::Page>, RepositoryError>;

    async fn find_children(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError>;

    async fn find_ancestors(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, RepositoryError>;

    async fn find_descendants(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<
        (
            Vec<models::notion::page::Page>,
            Vec<models::notion::page::PageRelationship>,
        ),
        RepositoryError,
    >;

    async fn find_by_id(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<models::notion::page::Page, RepositoryError>;

    async fn add(
        &self,
        parent_id: &Option<models::notion::page::PageId>,
        add_page: models::notion::page::AddPage,
    ) -> Result<models::notion::page::Page, RepositoryError>;

    async fn update(
        &self,
        id: &models::notion::page::PageId,
        update_page: models::notion::page::UpdatePage,
    ) -> Result<models::notion::page::Page, RepositoryError>;

    async fn remove(&self, id: &models::notion::page::PageId) -> Result<(), RepositoryError>;

    async fn move_(
        &self,
        id: &models::notion::page::PageId,
        target: &models::notion::page::MoveTarget,
    ) -> Result<(), RepositoryError>;
}
