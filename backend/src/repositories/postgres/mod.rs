#[macro_use]
mod macros;

pub mod channel;
pub mod message;
pub mod notion;
pub mod thread;
mod utils;

use sqlx::{postgres::PgPoolOptions, PgPool};

pub async fn connect_pool(database_url: &str) -> PgPool {
    PgPoolOptions::new().connect(database_url).await.unwrap()
}
