mod channel;
pub mod handlers;

use self::channel::Channel;
use crate::repositories::{
    interfaces::channel::IChannelRepository, sqlx::channel::ChannelRepository,
};
use async_graphql::{Context, EmptyMutation, EmptySubscription, Object, Schema};
use sqlx::PgPool;

pub type MySchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn health_check(&self) -> &str {
        "OK"
    }

    async fn get_channel_list(&self, ctx: &Context<'_>) -> Vec<Channel> {
        let pool = ctx.data_unchecked::<PgPool>();
        let channel_repository = ChannelRepository::new(&pool);
        channel_repository
            .list()
            .await
            .into_iter()
            .map(|c| c.into())
            .collect()
    }
}
