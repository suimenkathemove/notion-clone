use crate::repositories::interfaces::channel::IChannelRepository;
use async_trait::async_trait;
use sqlx::{query_as, FromRow, PgPool};
use std::sync::Arc;
use uuid::Uuid;

define_id!(ChannelId, models::channel::ChannelId);

define_name!(ChannelName, models::channel::ChannelName);

#[derive(FromRow)]
pub struct Channel {
    pub id: ChannelId,
    pub name: ChannelName,
}

impl Into<models::channel::Channel> for Channel {
    fn into(self) -> models::channel::Channel {
        models::channel::Channel {
            id: self.id.into(),
            name: self.name.into(),
        }
    }
}

pub struct ChannelRepository {
    pool: Arc<PgPool>,
}

impl ChannelRepository {
    pub fn new(pool: Arc<PgPool>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl IChannelRepository for ChannelRepository {
    async fn list(&self) -> Vec<models::channel::Channel> {
        query_as::<_, Channel>("SELECT * FROM channels")
            .fetch_all(&*self.pool)
            .await
            .unwrap()
            .into_iter()
            .map(|c| c.into())
            .collect()
    }

    async fn create(&self, channel_name: models::channel::ChannelName) -> models::channel::Channel {
        query_as::<_, Channel>("INSERT INTO channels (name) VALUES ($1) RETURNING *")
            .bind(channel_name.0)
            .fetch_one(&*self.pool)
            .await
            .unwrap()
            .into()
    }
}
