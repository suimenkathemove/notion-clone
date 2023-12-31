use crate::use_cases::error::UseCaseError;
use async_graphql::{Enum, SimpleObject};

#[derive(Clone, Copy, PartialEq, Eq, Enum)]
#[non_exhaustive]
pub enum GraphQLErrorCode {
    NotFound,
    InternalServerError,
}

impl From<UseCaseError> for GraphQLErrorCode {
    fn from(error: UseCaseError) -> Self {
        match error {
            UseCaseError::NotFound => Self::NotFound,
            UseCaseError::Unknown => Self::InternalServerError,
        }
    }
}

#[derive(SimpleObject)]
pub struct GraphQLError {
    pub code: GraphQLErrorCode,
}
