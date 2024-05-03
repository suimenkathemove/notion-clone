use backend::repositories::postgres::page;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    page::mock::seed_mock().await?;

    Ok(())
}
