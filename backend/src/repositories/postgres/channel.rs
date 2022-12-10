use crate::{models::channel::Channel, repositories::interfaces::channel::IChannelRepository};
use async_trait::async_trait;
use sqlx::{query_as, PgPool};

pub struct ChannelRepository<'a> {
    pool: &'a PgPool,
}

impl<'a> ChannelRepository<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl<'a> IChannelRepository for ChannelRepository<'a> {
    async fn list(&self) -> Vec<Channel> {
        query_as::<_, Channel>("SELECT * FROM channels")
            .fetch_all(self.pool)
            .await
            .unwrap()
    }
}
