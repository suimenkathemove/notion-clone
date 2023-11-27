use chrono::{DateTime, Utc};

#[derive(Debug)]
pub struct DateTimeUtc(pub DateTime<Utc>);
