use super::thread::Thread;
use crate::use_cases::{channel::ChannelUseCase, thread::ThreadUseCase};
use async_graphql::{Context, Object};
use uuid::Uuid;

pub struct Channel(models::channel::Channel);

impl From<models::channel::Channel> for Channel {
    fn from(channel: models::channel::Channel) -> Self {
        Self(channel)
    }
}

#[Object]
impl Channel {
    async fn id(&self) -> Uuid {
        self.0.id.0
    }

    async fn name(&self) -> &str {
        &self.0.name.0
    }

    async fn threads(&self, ctx: &Context<'_>) -> Vec<Thread> {
        let thread_use_case = ctx.data_unchecked::<ThreadUseCase>();
        thread_use_case
            .list(&self.0.id)
            .await
            .into_iter()
            .map(|t| t.into())
            .collect()
    }
}

#[derive(Default)]
pub struct ChannelQuery;

#[Object]
impl ChannelQuery {
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
