use crate::repositories::interfaces::message::IMessageRepository;
use async_trait::async_trait;
use sqlx::{query_as, FromRow, PgPool};
use std::sync::Arc;
use uuid::Uuid;

define_id!(MessageId, models::message::MessageId);

#[derive(FromRow)]
pub struct Message {
    pub id: MessageId,
    pub text: String,
}

impl Into<models::message::Message> for Message {
    fn into(self) -> models::message::Message {
        models::message::Message {
            id: self.id.into(),
            text: self.text,
        }
    }
}

pub struct MessageRepository {
    pool: Arc<PgPool>,
}

impl MessageRepository {
    pub fn new(pool: Arc<PgPool>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl IMessageRepository for MessageRepository {
    async fn list_by_thread_id(
        &self,
        thread_id: &models::thread::ThreadId,
    ) -> Vec<models::message::Message> {
        query_as::<_, Message>("SELECT * FROM messages WHERE thread_id = $1")
            .bind(thread_id.0)
            .fetch_all(&*self.pool)
            .await
            .unwrap()
            .into_iter()
            .map(|m| m.into())
            .collect()
    }
}