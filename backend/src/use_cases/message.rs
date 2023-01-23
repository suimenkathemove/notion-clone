use crate::repositories::interfaces::message::IMessageRepository;
use std::sync::Arc;

pub struct MessageUseCase {
    message_repository: Arc<dyn IMessageRepository>,
}

impl MessageUseCase {
    pub fn new(message_repository: Arc<dyn IMessageRepository>) -> Self {
        Self { message_repository }
    }

    pub async fn list_by_thread_id(
        &self,
        thread_id: &models::thread::ThreadId,
    ) -> Vec<models::message::Message> {
        self.message_repository
            .list_by_thread_id(thread_id)
            .await
            .into_iter()
            .map(|m| m.into())
            .collect()
    }
}
