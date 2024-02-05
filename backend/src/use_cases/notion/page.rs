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

    pub async fn list_roots(&self) -> Result<Vec<models::notion::page::Page>, UseCaseError> {
        let pages = self.page_repository.find_roots().await?;

        Ok(pages)
    }

    pub async fn list_children(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, UseCaseError> {
        let pages = self.page_repository.find_children(id).await?;

        Ok(pages)
    }

    pub async fn list_ancestors(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<Vec<models::notion::page::Page>, UseCaseError> {
        let pages = self.page_repository.find_ancestors(id).await?;

        Ok(pages)
    }

    pub async fn list_descendants(
        &self,
        id: &models::notion::page::PageId,
    ) -> Result<models::notion::page::PageTree, UseCaseError> {
        let (pages, parent_child_relationships) = self.page_repository.find_descendants(id).await?;
        let page_tree =
            models::notion::page::PageTree::build(pages, &parent_child_relationships, id);

        Ok(page_tree)
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
        add_page: models::notion::page::AddPage,
    ) -> Result<models::notion::page::Page, UseCaseError> {
        let page = self.page_repository.add(parent_id, add_page).await?;

        Ok(page)
    }

    pub async fn update(
        &self,
        id: &models::notion::page::PageId,
        update_page: models::notion::page::UpdatePage,
    ) -> Result<models::notion::page::Page, UseCaseError> {
        let page = self.page_repository.update(id, update_page).await?;

        Ok(page)
    }

    pub async fn remove(&self, id: &models::notion::page::PageId) -> Result<(), UseCaseError> {
        self.page_repository.remove(id).await?;

        Ok(())
    }

    pub async fn move_(
        &self,
        id: &models::notion::page::PageId,
        target: &models::notion::page::MoveTarget,
    ) -> Result<(), UseCaseError> {
        self.page_repository.move_(id, target).await?;

        Ok(())
    }
}
