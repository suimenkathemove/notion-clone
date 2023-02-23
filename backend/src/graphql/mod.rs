#[macro_use]
mod macros;

mod channel;
pub mod handlers;
mod health_check;
mod message;
mod thread;
mod utils;

use self::{
    channel::{ChannelMutation, ChannelQuery},
    health_check::HealthCheckQuery,
    message::MessageMutation,
    thread::ThreadQuery,
};
use async_graphql::{EmptySubscription, MergedObject, Schema};

pub type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[derive(Default, MergedObject)]
pub struct QueryRoot(HealthCheckQuery, ChannelQuery, ThreadQuery);

#[derive(Default, MergedObject)]
pub struct MutationRoot(ChannelMutation, MessageMutation);
