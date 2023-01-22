use crate::use_cases::channel::ChannelUseCase;
use async_graphql::{Context, Object, SimpleObject};
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
