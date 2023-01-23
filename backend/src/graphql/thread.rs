use super::{channel::ChannelId, message::Message};
use crate::use_cases::{message::MessageUseCase, thread::ThreadUseCase};
use async_graphql::{scalar, Context, Object};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

define_id!(ThreadId, models::thread::ThreadId);

pub struct Thread {
    pub id: ThreadId,
}

impl From<models::thread::Thread> for Thread {
    fn from(thread: models::thread::Thread) -> Self {
        Self {
            id: thread.id.into(),
        }
    }
}

#[Object]
impl Thread {
    async fn id(&self) -> ThreadId {
        self.id
    }

    async fn messages(&self, ctx: &Context<'_>) -> Vec<Message> {
        let message_use_case = ctx.data_unchecked::<MessageUseCase>();
        message_use_case
            .list_by_thread_id(&self.id.into())
            .await
            .into_iter()
            .map(|m| m.into())
            .collect()
    }
}

#[derive(Default)]
pub struct ThreadQuery;

#[Object]
impl ThreadQuery {
    async fn get_thread_list_by_channel_id(
        &self,
        ctx: &Context<'_>,
        channel_id: ChannelId,
    ) -> Vec<Thread> {
        let thread_use_case = ctx.data_unchecked::<ThreadUseCase>();
        thread_use_case
            .list(&channel_id.into())
            .await
            .into_iter()
            .map(|t| t.into())
            .collect()
    }
}
