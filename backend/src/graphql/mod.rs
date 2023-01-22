mod channel;
pub mod handlers;

use self::channel::Channel;
use crate::use_cases::channel::ChannelUseCase;
use async_graphql::{Context, EmptyMutation, EmptySubscription, Object, Schema};

pub type MySchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn health_check(&self) -> &str {
        "OK"
    }

    async fn get_channel_list(&self, ctx: &Context<'_>) -> Vec<Channel> {
        let channel_use_case = ctx.data_unchecked::<ChannelUseCase>();
        channel_use_case
            .list()
            .await
            .into_iter()
            .map(|c| c.into())
            .collect()
    }
}
