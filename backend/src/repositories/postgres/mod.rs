#[macro_use]
mod macros;

mod common;
pub mod notion;
pub mod slack;

use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

pub async fn create_pool() -> Pool<Postgres> {
    let database_url = std::env::var("DATABASE_URL").unwrap();
    PgPoolOptions::new().connect(&database_url).await.unwrap()
}
