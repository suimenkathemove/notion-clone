use chrono::{DateTime, Utc};

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct DateTimeUtc(pub DateTime<Utc>);
