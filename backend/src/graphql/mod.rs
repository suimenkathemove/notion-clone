mod channel;
pub mod handlers;
mod health_check;
mod thread;

use self::{channel::ChannelQuery, health_check::HealthCheckQuery};
use async_graphql::{EmptyMutation, EmptySubscription, MergedObject, Schema};

pub type MySchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

#[derive(Default, MergedObject)]
pub struct QueryRoot(HealthCheckQuery, ChannelQuery);
