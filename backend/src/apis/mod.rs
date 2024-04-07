#[macro_use]
mod macros;

mod common;
mod error;
pub mod handlers;
mod health_check;
mod notion;

use self::{
    health_check::HealthCheckQuery,
    notion::{NotionMutationRoot, NotionQueryRoot},
};
use async_graphql::{EmptySubscription, MergedObject, Schema};

pub type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[derive(Default, MergedObject)]
pub struct QueryRoot(HealthCheckQuery, NotionQueryRoot);

#[derive(Default, MergedObject)]
pub struct MutationRoot(NotionMutationRoot);
