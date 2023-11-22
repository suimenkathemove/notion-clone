mod channel;
mod message;
mod thread;

use self::{
    channel::{ChannelMutation, ChannelQuery},
    message::MessageMutation,
    thread::ThreadQuery,
};
use async_graphql::MergedObject;

#[derive(Default, MergedObject)]
pub struct SlackQueryRoot(ChannelQuery, ThreadQuery);

#[derive(Default, MergedObject)]
pub struct SlackMutationRoot(ChannelMutation, MessageMutation);
