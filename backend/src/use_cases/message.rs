use crate::repositories::interfaces::{message::IMessageRepository, thread::IThreadRepository};
use std::sync::Arc;

pub struct MessageUseCase {
    thread_repository: Arc<dyn IThreadRepository>,
    message_repository: Arc<dyn IMessageRepository>,
}

impl MessageUseCase {
    pub fn new(
        thread_repository: Arc<dyn IThreadRepository>,
        message_repository: Arc<dyn IMessageRepository>,
    ) -> Self {
        Self {
            thread_repository,
            message_repository,
        }
    }

    pub async fn list_by_thread_id(
        &self,
        thread_id: &models::thread::ThreadId,
    ) -> Vec<models::message::Message> {
        self.message_repository.list_by_thread_id(thread_id).await
    }

    pub async fn add_message(
        &self,
        channel_id: &models::channel::ChannelId,
        text: String,
    ) -> models::message::Message {
        let thread = self.thread_repository.create(channel_id).await;
        self.message_repository.create(&thread.id, text).await
    }

    pub async fn reply(
        &self,
        thread_id: &models::thread::ThreadId,
        text: String,
    ) -> models::message::Message {
        self.message_repository.create(thread_id, text).await
    }

    pub async fn delete(&self, id: &models::message::MessageId) {
        self.message_repository.delete(id).await;
    }
}
