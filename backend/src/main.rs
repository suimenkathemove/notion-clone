mod graphql;
mod repositories;

use crate::{
    graphql::{
        handlers::{graphql_handler::graphql_handler, graphql_playground::graphql_playground},
        QueryRoot,
    },
    repositories::sqlx::connect_pool,
};
use async_graphql::{EmptyMutation, EmptySubscription, Schema};
use axum::{
    http::{header::CONTENT_TYPE, HeaderValue},
    routing::get,
    Extension, Router,
};
use dotenv::dotenv;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "backend=trace".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    dotenv().ok();

    let pool = {
        let database_url = std::env::var("DATABASE_URL").unwrap();
        connect_pool(&database_url).await
    };

    let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
        .data(pool)
        .finish();

    let app = Router::new()
        .route("/", get(graphql_playground).post(graphql_handler))
        .layer(Extension(schema))
        .layer(
            CorsLayer::new()
                .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
                .allow_methods(Any)
                .allow_headers(vec![CONTENT_TYPE]),
        );

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
