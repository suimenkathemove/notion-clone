#[macro_use]
mod macros;

pub mod notion;
pub mod slack;
mod utils;

use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

pub async fn create_pool() -> Pool<Postgres> {
    dotenv::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").unwrap();
    PgPoolOptions::new().connect(&database_url).await.unwrap()
}
