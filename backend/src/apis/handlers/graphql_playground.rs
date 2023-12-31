use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use axum::response::{self, IntoResponse};

pub async fn graphql_playground() -> impl IntoResponse {
    response::Html(playground_source(GraphQLPlaygroundConfig::new("/")))
}
