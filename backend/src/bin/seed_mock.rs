use backend::repositories::postgres::notion;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    notion::page::mock::seed_mock().await?;

    Ok(())
}
