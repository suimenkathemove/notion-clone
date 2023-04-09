#[macro_use]
mod macros;

mod channel;
mod error;
pub mod handlers;
mod health_check;
mod message;
mod notion;
mod thread;
mod utils;

use self::{
    channel::{ChannelMutation, ChannelQuery},
    health_check::HealthCheckQuery,
    message::MessageMutation,
    notion::{NotionMutationRoot, NotionQueryRoot},
    thread::ThreadQuery,
};
use async_graphql::{EmptySubscription, MergedObject, Schema};

pub type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[derive(Default, MergedObject)]
pub struct QueryRoot(HealthCheckQuery, ChannelQuery, ThreadQuery, NotionQueryRoot);

#[derive(Default, MergedObject)]
pub struct MutationRoot(ChannelMutation, MessageMutation, NotionMutationRoot);
