pub mod channel;

use sqlx::{postgres::PgPoolOptions, PgPool};

pub async fn connect_pool(database_url: &str) -> PgPool {
    PgPoolOptions::new().connect(database_url).await.unwrap()
}
