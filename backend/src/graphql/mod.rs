#[macro_use]
mod macros;

mod channel;
pub mod handlers;
mod health_check;
mod message;
mod thread;

use self::{
    channel::{ChannelMutation, ChannelQuery},
    health_check::HealthCheckQuery,
    thread::ThreadQuery,
};
use async_graphql::{EmptySubscription, MergedObject, Schema};

pub type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[derive(Default, MergedObject)]
pub struct QueryRoot(HealthCheckQuery, ChannelQuery, ThreadQuery);

#[derive(Default, MergedObject)]
pub struct MutationRoot(ChannelMutation);
