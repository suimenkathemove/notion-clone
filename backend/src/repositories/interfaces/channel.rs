use async_trait::async_trait;

#[async_trait]
pub trait IChannelRepository: Send + Sync {
    async fn list(&self) -> Vec<models::channel::Channel>;

    async fn get(&self, id: &models::channel::ChannelId) -> models::channel::Channel;

    async fn create(
        &self,
        name: models::channel::ChannelName,
        description: String,
        private: bool,
    ) -> models::channel::Channel;

    async fn delete(&self, id: &models::channel::ChannelId);
}
