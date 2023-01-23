use async_graphql::SimpleObject;
use uuid::Uuid;

#[derive(SimpleObject)]
pub struct Thread {
    pub id: Uuid,
}

impl From<models::thread::Thread> for Thread {
    fn from(thread: models::thread::Thread) -> Self {
        Self { id: thread.id.0 }
    }
}
