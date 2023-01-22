use crate::repositories::interfaces::channel::IChannelRepository;
use std::sync::Arc;

pub struct ChannelUseCase {
    channel_repository: Arc<dyn IChannelRepository>,
}

impl ChannelUseCase {
    pub fn new(channel_repository: Arc<dyn IChannelRepository>) -> Self {
        Self { channel_repository }
    }

    pub async fn list(&self) -> Vec<models::channel::Channel> {
        self.channel_repository
            .list()
            .await
            .into_iter()
            .map(|c| c.into())
            .collect()
    }
}
