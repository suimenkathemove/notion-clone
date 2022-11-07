mod graphql;

use crate::graphql::{
    handlers::{graphql_handler::graphql_handler, graphql_playground::graphql_playground},
    QueryRoot,
};
use async_graphql::{EmptyMutation, EmptySubscription, Schema};
use axum::{routing::get, Extension, Router};
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "backend=trace".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription).finish();

    let app = Router::new()
        .route("/", get(graphql_playground).post(graphql_handler))
        .layer(Extension(schema));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
