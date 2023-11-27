use async_trait::async_trait;

#[async_trait]
pub trait IChannelRepository: Send + Sync {
    async fn list(&self) -> Vec<models::slack::channel::Channel>;

    async fn get(&self, id: &models::slack::channel::ChannelId) -> models::slack::channel::Channel;

    async fn create(
        &self,
        name: models::slack::channel::ChannelName,
        description: String,
        private: bool,
    ) -> models::slack::channel::Channel;

    async fn delete(&self, id: &models::slack::channel::ChannelId);
}
