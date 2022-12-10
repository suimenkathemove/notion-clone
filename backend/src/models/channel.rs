use async_graphql::SimpleObject;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(FromRow, SimpleObject)]
pub struct Channel {
    pub id: Uuid,
}
