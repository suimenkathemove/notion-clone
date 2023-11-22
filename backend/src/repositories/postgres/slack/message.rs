use crate::repositories::{
    interfaces::slack::message::IMessageRepository, postgres::utils::DateTimeUtc,
};
use async_trait::async_trait;
use sqlx::{query, query_as, FromRow, PgPool};
use std::sync::Arc;

define_id!(MessageId, models::message::MessageId);

#[derive(FromRow)]
pub struct Message {
    pub id: MessageId,
    pub text: String,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

impl From<Message> for models::message::Message {
    fn from(value: Message) -> Self {
        Self {
            id: value.id.into(),
            text: value.text,
            created_at: value.created_at.into(),
            updated_at: value.updated_at.into(),
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
            .map(Into::into)
            .collect()
    }

    async fn create(
        &self,
        thread_id: &models::thread::ThreadId,
        text: String,
    ) -> models::message::Message {
        query_as::<_, Message>("INSERT INTO messages (thread_id, text) VALUES ($1, $2) RETURNING *")
            .bind(thread_id.0)
            .bind(text)
            .fetch_one(&*self.pool)
            .await
            .unwrap()
            .into()
    }

    async fn delete(&self, id: &models::message::MessageId) {
        query("DELETE FROM messages WHERE id = $1")
            .bind(id.0)
            .execute(&*self.pool)
            .await
            .unwrap();
    }
}
