use async_trait::async_trait;

#[async_trait]
pub trait IThreadRepository: Send + Sync {
    async fn list_by_channel_id(
        &self,
        channel_id: &models::slack::channel::ChannelId,
    ) -> Vec<models::slack::thread::Thread>;

    async fn get(&self, id: &models::slack::thread::ThreadId) -> models::slack::thread::Thread;

    async fn create(
        &self,
        channel_id: &models::slack::channel::ChannelId,
    ) -> models::slack::thread::Thread;

    async fn delete(&self, id: &models::slack::thread::ThreadId);
}
