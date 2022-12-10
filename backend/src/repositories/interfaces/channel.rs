use crate::models::channel::Channel;
use async_trait::async_trait;

#[async_trait]
pub trait IChannelRepository {
    async fn list(&self) -> Vec<Channel>;
}
