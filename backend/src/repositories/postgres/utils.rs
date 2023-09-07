use sqlx::types::chrono::{DateTime, Utc};

#[derive(Debug, sqlx::Type)]
#[sqlx(transparent)]
pub struct DateTimeUtc(pub DateTime<Utc>);

impl From<DateTimeUtc> for models::utils::DateTimeUtc {
    fn from(value: DateTimeUtc) -> Self {
        Self(value.0)
    }
}
