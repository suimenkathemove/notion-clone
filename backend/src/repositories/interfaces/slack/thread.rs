use async_trait::async_trait;

#[async_trait]
pub trait IThreadRepository: Send + Sync {
    async fn list_by_channel_id(
        &self,
        channel_id: &models::channel::ChannelId,
    ) -> Vec<models::thread::Thread>;

    async fn get(&self, id: &models::thread::ThreadId) -> models::thread::Thread;

    async fn create(&self, channel_id: &models::channel::ChannelId) -> models::thread::Thread;

    async fn delete(&self, id: &models::thread::ThreadId);
}
