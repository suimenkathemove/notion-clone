use crate::utils::DateTimeUtc;

define_id!(PageId);

#[derive(Debug)]
pub struct Page {
    pub id: PageId,
    pub title: String,
    pub text: String,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}
