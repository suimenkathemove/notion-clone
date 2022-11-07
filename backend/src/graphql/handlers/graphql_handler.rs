use super::super::MySchema;
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::extract::Extension;

pub async fn graphql_handler(schema: Extension<MySchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}
