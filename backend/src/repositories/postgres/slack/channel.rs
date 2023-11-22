use crate::repositories::{
    interfaces::slack::channel::IChannelRepository, postgres::utils::DateTimeUtc,
};
use async_trait::async_trait;
use sqlx::{query, query_as, FromRow, PgPool};
use std::sync::Arc;

define_id!(ChannelId, models::channel::ChannelId);

define_name!(ChannelName, models::channel::ChannelName);

#[derive(FromRow)]
pub struct Channel {
    pub id: ChannelId,
    pub name: ChannelName,
    pub description: String,
    pub private: bool,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

impl From<Channel> for models::channel::Channel {
    fn from(value: Channel) -> Self {
        Self {
            id: value.id.into(),
            name: value.name.into(),
            description: value.description,
            private: value.private,
            created_at: value.created_at.into(),
            updated_at: value.updated_at.into(),
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
            .map(Into::into)
            .collect()
    }

    async fn get(&self, id: &models::channel::ChannelId) -> models::channel::Channel {
        query_as::<_, Channel>("SELECT * FROM channels WHERE id = $1")
            .bind(id.0)
            .fetch_one(&*self.pool)
            .await
            .unwrap()
            .into()
    }

    async fn create(
        &self,
        name: models::channel::ChannelName,
        description: String,
        private: bool,
    ) -> models::channel::Channel {
        query_as::<_, Channel>(
            "INSERT INTO channels (name, description, private) VALUES ($1, $2, $3) RETURNING *",
        )
        .bind(name.0)
        .bind(description)
        .bind(private)
        .fetch_one(&*self.pool)
        .await
        .unwrap()
        .into()
    }

    async fn delete(&self, id: &models::channel::ChannelId) {
        query("DELETE FROM channels WHERE id = $1")
            .bind(id.0)
            .execute(&*self.pool)
            .await
            .unwrap();
    }
}
