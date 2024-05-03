#[macro_use]
mod macros;

mod common;
mod error;
pub mod handlers;
mod health_check;
mod page;

use async_graphql::{EmptySubscription, MergedObject, Schema};
use health_check::HealthCheckQuery;
use page::{PageMutation, PageQuery};

pub type MySchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[derive(Default, MergedObject)]
pub struct QueryRoot(HealthCheckQuery, PageQuery);

#[derive(Default, MergedObject)]
pub struct MutationRoot(PageMutation);
