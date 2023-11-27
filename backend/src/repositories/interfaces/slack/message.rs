use async_trait::async_trait;

#[async_trait]
pub trait IMessageRepository: Send + Sync {
    async fn list_by_thread_id(
        &self,
        thread_id: &models::slack::thread::ThreadId,
    ) -> Vec<models::slack::message::Message>;

    async fn create(
        &self,
        thread_id: &models::slack::thread::ThreadId,
        text: String,
    ) -> models::slack::message::Message;

    async fn delete(&self, id: &models::slack::message::MessageId);
}
