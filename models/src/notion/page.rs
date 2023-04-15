use crate::utils::DateTimeUtc;

define_id!(PageId);

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Page {
    pub id: PageId,
    pub title: String,
    pub text: String,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}
