use async_trait::async_trait;

#[async_trait]
pub trait IThreadRepository: Send + Sync {
    async fn list(&self, channel_id: &models::channel::ChannelId) -> Vec<models::thread::Thread>;
}
