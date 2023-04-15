use super::super::error::UseCaseError;
use crate::repositories::interfaces::notion::page::IPageRepository;
use std::sync::Arc;

pub struct PageUseCase {
    page_repository: Arc<dyn IPageRepository>,
}

impl PageUseCase {
    pub fn new(page_repository: Arc<dyn IPageRepository>) -> Self {
        Self { page_repository }
    }

    pub async fn list(&self) -> Result<Vec<models::notion::page::Page>, UseCaseError> {
        let pages = self.page_repository.find_list().await?;

        Ok(pages)
    }

    pub async fn descendants(
        &self,
        parent_id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, UseCaseError> {
        let pages = self.page_repository.find_descendants(parent_id).await?;

        Ok(pages)
    }

    pub async fn get(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<models::notion::page::Page, UseCaseError> {
        let page = self.page_repository.find_by_id(id).await?;

        Ok(page)
    }

    pub async fn add(
        &self,
        parent_id: &Option<models::notion::page::PageId>,
        title: String,
        text: String,
    ) -> Result<models::notion::page::Page, UseCaseError> {
        let page = self.page_repository.add(parent_id, title, text).await?;

        Ok(page)
    }
}
