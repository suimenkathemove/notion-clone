use sqlx::types::chrono::{DateTime, Utc};

#[derive(sqlx::Type)]
#[sqlx(transparent)]
pub struct DateTimeUtc(pub DateTime<Utc>);

impl Into<models::utils::DateTimeUtc> for DateTimeUtc {
    fn into(self) -> models::utils::DateTimeUtc {
        models::utils::DateTimeUtc(self.0)
    }
}
