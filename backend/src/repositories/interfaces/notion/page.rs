use async_trait::async_trait;

#[async_trait]
pub trait IPageRepository: Send + Sync {
    async fn find_list(&self) -> Vec<models::notion::page::Page>;

    async fn create(&self, title: String, text: String) -> models::notion::page::Page;
}
