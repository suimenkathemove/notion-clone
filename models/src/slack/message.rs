use crate::common::DateTimeUtc;

define_id!(MessageId);

pub struct Message {
    pub id: MessageId,
    pub text: String,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}
