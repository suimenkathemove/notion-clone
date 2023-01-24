use crate::repositories::interfaces::thread::IThreadRepository;
use async_trait::async_trait;
use sqlx::{query_as, FromRow, PgPool};
use std::sync::Arc;
use uuid::Uuid;

define_id!(ThreadId, models::thread::ThreadId);

#[derive(FromRow)]
pub struct Thread {
    pub id: ThreadId,
}

impl Into<models::thread::Thread> for Thread {
    fn into(self) -> models::thread::Thread {
        models::thread::Thread { id: self.id.into() }
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
    async fn list(&self, channel_id: &models::channel::ChannelId) -> Vec<models::thread::Thread> {
        query_as::<_, Thread>("SELECT * FROM threads WHERE channel_id = $1")
            .bind(channel_id.0)
            .fetch_all(&*self.pool)
            .await
            .unwrap()
            .into_iter()
            .map(|t| t.into())
            .collect()
    }

    async fn create(&self, channel_id: &models::channel::ChannelId) -> models::thread::Thread {
        query_as::<_, Thread>("INSERT INTO threads (channel_id) VALUES ($1) RETURNING *")
            .bind(channel_id.0)
            .fetch_one(&*self.pool)
            .await
            .unwrap()
            .into()
    }
}
