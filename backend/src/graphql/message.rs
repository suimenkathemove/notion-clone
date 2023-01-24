use super::{channel::ChannelId, thread::ThreadId};
use crate::use_cases::message::MessageUseCase;
use async_graphql::{scalar, Context, Object};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

define_id!(MessageId, models::message::MessageId);

pub struct Message {
    pub id: MessageId,
    pub text: String,
}

impl From<models::message::Message> for Message {
    fn from(message: models::message::Message) -> Self {
        Self {
            id: message.id.into(),
            text: message.text,
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
}

#[derive(Default)]
pub struct MessageMutation;

#[Object]
impl MessageMutation {
    async fn add_message(
        &self,
        ctx: &Context<'_>,
        channel_id: ChannelId,
        message_text: String,
    ) -> Message {
        let message_use_case = ctx.data_unchecked::<MessageUseCase>();
        message_use_case
            .add_message(&channel_id.into(), message_text)
            .await
            .into()
    }

    async fn add_message_to_thread(
        &self,
        ctx: &Context<'_>,
        thread_id: ThreadId,
        message_text: String,
    ) -> Message {
        let message_use_case = ctx.data_unchecked::<MessageUseCase>();
        message_use_case
            .add_message_to_thread(&thread_id.into(), message_text)
            .await
            .into()
    }
}
