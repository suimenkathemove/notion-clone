mod graphql;
mod repositories;
mod use_cases;

use crate::{
    graphql::{
        handlers::{graphql_handler::graphql_handler, graphql_playground::graphql_playground},
        MutationRoot, QueryRoot,
    },
    repositories::postgres::{
        channel::ChannelRepository, connect_pool, message::MessageRepository,
        thread::ThreadRepository,
    },
    use_cases::{channel::ChannelUseCase, message::MessageUseCase, thread::ThreadUseCase},
};
use async_graphql::{EmptySubscription, Schema};
use axum::{
    http::{header::CONTENT_TYPE, HeaderValue},
    routing::get,
    Extension, Router,
};
use dotenv::dotenv;
use repositories::interfaces::{
    channel::IChannelRepository, message::IMessageRepository, thread::IThreadRepository,
};
use std::{net::SocketAddr, sync::Arc};
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
        let pool = connect_pool(&database_url).await;
        Arc::new(pool)
    };

    let channel_repository: Arc<dyn IChannelRepository> =
        Arc::new(ChannelRepository::new(Arc::clone(&pool)));
    let thread_repository: Arc<dyn IThreadRepository> =
        Arc::new(ThreadRepository::new(Arc::clone(&pool)));
    let message_repository: Arc<dyn IMessageRepository> =
        Arc::new(MessageRepository::new(Arc::clone(&pool)));

    let channel_use_case = ChannelUseCase::new(Arc::clone(&channel_repository));
    let thread_use_case = ThreadUseCase::new(Arc::clone(&thread_repository));
    let message_use_case = MessageUseCase::new(
        Arc::clone(&thread_repository),
        Arc::clone(&message_repository),
    );

    let schema = Schema::build(
        QueryRoot::default(),
        MutationRoot::default(),
        EmptySubscription,
    )
    .data(channel_use_case)
    .data(thread_use_case)
    .data(message_use_case)
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
