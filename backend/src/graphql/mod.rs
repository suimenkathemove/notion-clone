pub mod handlers;

use async_graphql::{EmptyMutation, EmptySubscription, Object, Schema};

pub type MySchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn health_check(&self) -> &str {
        "OK"
    }
}
