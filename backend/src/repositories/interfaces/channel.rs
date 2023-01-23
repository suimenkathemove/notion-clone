use async_trait::async_trait;

#[async_trait]
pub trait IChannelRepository: Send + Sync {
    async fn list(&self) -> Vec<models::channel::Channel>;

    async fn create(&self, channel_name: models::channel::ChannelName) -> models::channel::Channel;
}
