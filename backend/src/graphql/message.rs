use super::{channel::ChannelId, thread::ThreadId, utils::DateTimeUtc};
use crate::use_cases::message::MessageUseCase;
use async_graphql::{scalar, Context, Object, SimpleObject};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

define_id!(MessageId, models::message::MessageId);

pub struct Message {
    pub id: MessageId,
    pub text: String,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

impl From<models::message::Message> for Message {
    fn from(message: models::message::Message) -> Self {
        Self {
            id: message.id.into(),
            text: message.text,
            created_at: message.created_at.into(),
            updated_at: message.updated_at.into(),
        }
    }
}

#[Object]
impl Message {
    async fn id(&self) -> MessageId {
        self.id
    }

    async fn text(&self) -> String {
        self.text.to_owned()
    }

    async fn created_at(&self) -> &DateTimeUtc {
        &self.created_at
    }

    async fn updated_at(&self) -> &DateTimeUtc {
        &self.updated_at
    }
}

#[derive(SimpleObject)]
struct DeleteMessageOutput {
    id: MessageId,
}

#[derive(Default)]
pub struct MessageMutation;

#[Object]
impl MessageMutation {
    async fn add_message(&self, ctx: &Context<'_>, channel_id: ChannelId, text: String) -> Message {
        let message_use_case = ctx.data_unchecked::<MessageUseCase>();
        message_use_case
            .add_message(&channel_id.into(), text)
            .await
            .into()
    }

    async fn reply(&self, ctx: &Context<'_>, thread_id: ThreadId, text: String) -> Message {
        let message_use_case = ctx.data_unchecked::<MessageUseCase>();
        message_use_case.reply(&thread_id.into(), text).await.into()
    }

    async fn delete_message(&self, ctx: &Context<'_>, id: MessageId) -> DeleteMessageOutput {
        let message_use_case = ctx.data_unchecked::<MessageUseCase>();
        message_use_case.delete(&id.into()).await;
        DeleteMessageOutput { id }
    }
}
