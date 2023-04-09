use super::utils::DateTimeUtc;
use crate::repositories::interfaces::channel::IChannelRepository;
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

impl Into<models::channel::Channel> for Channel {
    fn into(self) -> models::channel::Channel {
        models::channel::Channel {
            id: self.id.into(),
            name: self.name.into(),
            description: self.description,
            private: self.private,
            created_at: self.created_at.into(),
            updated_at: self.updated_at.into(),
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
