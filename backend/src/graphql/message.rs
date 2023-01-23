use async_graphql::{scalar, SimpleObject};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

define_id!(MessageId, models::message::MessageId);

#[derive(SimpleObject)]
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
