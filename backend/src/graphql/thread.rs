use super::{channel::ChannelId, message::Message, utils::DateTimeUtc};
use crate::use_cases::{message::MessageUseCase, thread::ThreadUseCase};
use async_graphql::{Context, Object, SimpleObject};

define_id!(ThreadId, models::thread::ThreadId);

pub struct Thread {
    pub id: ThreadId,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

impl From<models::thread::Thread> for Thread {
    fn from(thread: models::thread::Thread) -> Self {
        Self {
            id: thread.id.into(),
            created_at: thread.created_at.into(),
            updated_at: thread.updated_at.into(),
        }
    }
}

#[Object]
impl Thread {
    async fn id(&self) -> ThreadId {
        self.id
    }

    async fn created_at(&self) -> &DateTimeUtc {
        &self.created_at
    }

    async fn updated_at(&self) -> &DateTimeUtc {
        &self.updated_at
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

#[derive(SimpleObject)]
struct DeleteThreadOutput {
    id: ThreadId,
}

#[derive(Default)]
pub struct ThreadQuery;

#[Object]
impl ThreadQuery {
    async fn list_thread_by_channel_id(
        &self,
        ctx: &Context<'_>,
        channel_id: ChannelId,
    ) -> Vec<Thread> {
        let thread_use_case = ctx.data_unchecked::<ThreadUseCase>();
        thread_use_case
            .list_by_channel_id(&channel_id.into())
            .await
            .into_iter()
            .map(|t| t.into())
            .collect()
    }

    async fn get_thread(&self, ctx: &Context<'_>, id: ThreadId) -> Thread {
        let thread_use_case = ctx.data_unchecked::<ThreadUseCase>();
        thread_use_case.get(&id.into()).await.into()
    }

    async fn delete_thread(&self, ctx: &Context<'_>, id: ThreadId) -> DeleteThreadOutput {
        let thread_use_case = ctx.data_unchecked::<ThreadUseCase>();
        thread_use_case.delete(&id.into()).await;
        DeleteThreadOutput { id }
    }
}
