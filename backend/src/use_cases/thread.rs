use crate::repositories::interfaces::thread::IThreadRepository;
use std::sync::Arc;

pub struct ThreadUseCase {
    thread_repository: Arc<dyn IThreadRepository>,
}

impl ThreadUseCase {
    pub fn new(thread_repository: Arc<dyn IThreadRepository>) -> Self {
        Self { thread_repository }
    }

    pub async fn list(
        &self,
        channel_id: &models::channel::ChannelId,
    ) -> Vec<models::thread::Thread> {
        self.thread_repository
            .list(channel_id)
            .await
            .into_iter()
            .map(|t| t.into())
            .collect()
    }

    pub async fn get(&self, thread_id: &models::thread::ThreadId) -> models::thread::Thread {
        self.thread_repository.get(thread_id).await
    }
}
