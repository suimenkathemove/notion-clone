use crate::repositories::interfaces::notion::page::IPageRepository;
use std::sync::Arc;

pub struct PageUseCase {
    page_repository: Arc<dyn IPageRepository>,
}

impl PageUseCase {
    pub fn new(page_repository: Arc<dyn IPageRepository>) -> Self {
        Self { page_repository }
    }

    pub async fn list(&self) -> Vec<models::notion::page::Page> {
        self.page_repository.find_list().await
    }

    pub async fn create(&self, title: String, text: String) -> models::notion::page::Page {
        self.page_repository.create(title, text).await
    }
}
