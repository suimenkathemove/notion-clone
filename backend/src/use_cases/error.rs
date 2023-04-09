use crate::repositories::error::RepositoryError;

#[derive(Debug, thiserror::Error)]
#[non_exhaustive]
pub enum UseCaseError {
    #[error("NotFound")]
    NotFound,
    #[error("Unknown")]
    Unknown,
}

impl From<RepositoryError> for UseCaseError {
    fn from(error: RepositoryError) -> Self {
        match error {
            RepositoryError::NotFound => Self::NotFound,
            RepositoryError::Unknown => Self::Unknown,
        }
    }
}
