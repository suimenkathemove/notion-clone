use crate::utils::DateTimeUtc;

define_id!(ChannelId);

define_name!(ChannelName);

pub struct Channel {
    pub id: ChannelId,
    pub name: ChannelName,
    pub description: String,
    pub private: bool,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}
