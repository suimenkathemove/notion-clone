use async_graphql::SimpleObject;
use uuid::Uuid;

#[derive(SimpleObject)]
pub struct Channel {
    pub id: Uuid,
    pub name: String,
}

impl From<models::channel::Channel> for Channel {
    fn from(channel: models::channel::Channel) -> Self {
        Self {
            id: channel.id.0,
            name: channel.name.0,
        }
    }
}
