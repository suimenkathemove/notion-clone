use crate::repositories::interfaces::channel::IChannelRepository;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct ChannelUseCase {
    channel_repository: Arc<Mutex<dyn IChannelRepository>>,
}

impl ChannelUseCase {
    pub fn new(channel_repository: Arc<Mutex<dyn IChannelRepository>>) -> Self {
        Self { channel_repository }
    }

    pub async fn list(&self) -> Vec<models::channel::Channel> {
        let channel_repository = self.channel_repository.lock().await;
        channel_repository
            .list()
            .await
            .into_iter()
            .map(|c| c.into())
            .collect()
    }
}
