use async_trait::async_trait;

#[async_trait]
pub trait IMessageRepository: Send + Sync {
    async fn list_by_thread_id(
        &self,
        thread_id: &models::thread::ThreadId,
    ) -> Vec<models::message::Message>;
}
