use crate::repositories::{
    interfaces::slack::thread::IThreadRepository, postgres::common::DateTimeUtc,
};
use async_trait::async_trait;
use sqlx::{query, query_as, FromRow, PgPool};
use std::sync::Arc;

define_id!(ThreadId, models::slack::thread::ThreadId);

#[derive(FromRow)]
pub struct Thread {
    pub id: ThreadId,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

impl From<Thread> for models::slack::thread::Thread {
    fn from(value: Thread) -> Self {
        Self {
            id: value.id.into(),
            created_at: value.created_at.into(),
            updated_at: value.updated_at.into(),
        }
    }
}

pub struct ThreadRepository {
    pool: Arc<PgPool>,
}

impl ThreadRepository {
    pub fn new(pool: Arc<PgPool>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl IThreadRepository for ThreadRepository {
    async fn list_by_channel_id(
        &self,
        channel_id: &models::slack::channel::ChannelId,
    ) -> Vec<models::slack::thread::Thread> {
        query_as::<_, Thread>("SELECT * FROM threads WHERE channel_id = $1")
            .bind(channel_id.0)
            .fetch_all(&*self.pool)
            .await
            .unwrap()
            .into_iter()
            .map(Into::into)
            .collect()
    }

    async fn get(&self, id: &models::slack::thread::ThreadId) -> models::slack::thread::Thread {
        query_as::<_, Thread>("SELECT * FROM threads WHERE id = $1")
            .bind(id.0)
            .fetch_one(&*self.pool)
            .await
            .unwrap()
            .into()
    }

    async fn create(
        &self,
        channel_id: &models::slack::channel::ChannelId,
    ) -> models::slack::thread::Thread {
        query_as::<_, Thread>("INSERT INTO threads (channel_id) VALUES ($1) RETURNING *")
            .bind(channel_id.0)
            .fetch_one(&*self.pool)
            .await
            .unwrap()
            .into()
    }

    async fn delete(&self, id: &models::slack::thread::ThreadId) {
        query("DELETE FROM threads WHERE id = $1")
            .bind(id.0)
            .execute(&*self.pool)
            .await
            .unwrap();
    }
}
