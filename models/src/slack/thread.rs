use crate::common::DateTimeUtc;

define_id!(ThreadId);

pub struct Thread {
    pub id: ThreadId,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}
