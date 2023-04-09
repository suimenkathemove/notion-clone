use super::utils::DateTimeUtc;
use crate::repositories::interfaces::thread::IThreadRepository;
use async_trait::async_trait;
use sqlx::{query, query_as, FromRow, PgPool};
use std::sync::Arc;

define_id!(ThreadId, models::thread::ThreadId);

#[derive(FromRow)]
pub struct Thread {
    pub id: ThreadId,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

impl Into<models::thread::Thread> for Thread {
    fn into(self) -> models::thread::Thread {
        models::thread::Thread {
            id: self.id.into(),
            created_at: self.created_at.into(),
            updated_at: self.updated_at.into(),
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
        channel_id: &models::channel::ChannelId,
    ) -> Vec<models::thread::Thread> {
        query_as::<_, Thread>("SELECT * FROM threads WHERE channel_id = $1")
            .bind(channel_id.0)
            .fetch_all(&*self.pool)
            .await
            .unwrap()
            .into_iter()
            .map(|t| t.into())
            .collect()
    }

    async fn get(&self, id: &models::thread::ThreadId) -> models::thread::Thread {
        query_as::<_, Thread>("SELECT * FROM threads WHERE id = $1")
            .bind(id.0)
            .fetch_one(&*self.pool)
            .await
            .unwrap()
            .into()
    }

    async fn create(&self, channel_id: &models::channel::ChannelId) -> models::thread::Thread {
        query_as::<_, Thread>("INSERT INTO threads (channel_id) VALUES ($1) RETURNING *")
            .bind(channel_id.0)
            .fetch_one(&*self.pool)
            .await
            .unwrap()
            .into()
    }

    async fn delete(&self, id: &models::thread::ThreadId) {
        query("DELETE FROM threads WHERE id = $1")
            .bind(id.0)
            .execute(&*self.pool)
            .await
            .unwrap();
    }
}
