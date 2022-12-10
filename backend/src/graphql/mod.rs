pub mod handlers;

use crate::{
    models::channel::Channel,
    repositories::{interfaces::channel::IChannelRepository, postgres::channel::ChannelRepository},
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
        let channels = channel_repository.list().await;
        channels
    }
}
