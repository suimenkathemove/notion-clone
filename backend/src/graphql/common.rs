use async_graphql::scalar;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct DateTimeUtc(pub DateTime<Utc>);

impl From<models::common::DateTimeUtc> for DateTimeUtc {
    fn from(date_time_utc: models::common::DateTimeUtc) -> Self {
        Self(date_time_utc.0)
    }
}

scalar!(DateTimeUtc);
