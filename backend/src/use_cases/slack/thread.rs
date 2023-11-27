use crate::repositories::interfaces::slack::thread::IThreadRepository;
use std::sync::Arc;

pub struct ThreadUseCase {
    thread_repository: Arc<dyn IThreadRepository>,
}

impl ThreadUseCase {
    pub fn new(thread_repository: Arc<dyn IThreadRepository>) -> Self {
        Self { thread_repository }
    }

    pub async fn list_by_channel_id(
        &self,
        channel_id: &models::slack::channel::ChannelId,
    ) -> Vec<models::slack::thread::Thread> {
        self.thread_repository.list_by_channel_id(channel_id).await
    }

    pub async fn get(&self, id: &models::slack::thread::ThreadId) -> models::slack::thread::Thread {
        self.thread_repository.get(id).await
    }

    pub async fn delete(&self, id: &models::slack::thread::ThreadId) {
        self.thread_repository.delete(id).await;
    }
}
