use async_graphql::Object;

#[derive(Default)]
pub struct HealthCheckQuery;

#[Object]
impl HealthCheckQuery {
    async fn health_check(&self) -> &str {
        "OK"
    }
}
