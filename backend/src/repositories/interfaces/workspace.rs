use super::super::error::RepositoryError;
use async_trait::async_trait;

#[async_trait]
pub trait IWorkspaceRepository: Send + Sync {
    async fn save(
        &self,
        workspace: models::workspace::Workspace,
    ) -> Result<models::workspace::Workspace, RepositoryError>;
}
