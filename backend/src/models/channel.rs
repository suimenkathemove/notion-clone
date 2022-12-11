use async_graphql::SimpleObject;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(FromRow, SimpleObject)]
pub struct Channel {
    id: Uuid,
}
