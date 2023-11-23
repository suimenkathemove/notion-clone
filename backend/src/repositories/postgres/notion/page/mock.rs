use super::InternalPageRepository;
use crate::repositories::postgres::create_pool;
use sqlx::{Postgres, Transaction};

pub(super) async fn insert_mock(
    tx: &mut Transaction<'_, Postgres>,
) -> anyhow::Result<[models::notion::page::Page; 8]> {
    let page_1 = InternalPageRepository::add(
        &None::<models::notion::page::PageId>,
        "1".to_string(),
        "".to_string(),
        tx,
    )
    .await?;

    let page_2 = InternalPageRepository::add(
        &None::<models::notion::page::PageId>,
        "2".to_string(),
        "".to_string(),
        tx,
    )
    .await?;

    let page_1_1 =
        InternalPageRepository::add(&Some(page_1.id), "1-1".to_string(), "".to_string(), tx)
            .await?;

    let page_1_2 =
        InternalPageRepository::add(&Some(page_1.id), "1-2".to_string(), "".to_string(), tx)
            .await?;

    let page_2_1 =
        InternalPageRepository::add(&Some(page_2.id), "2-1".to_string(), "".to_string(), tx)
            .await?;

    let page_2_2 =
        InternalPageRepository::add(&Some(page_2.id), "2-2".to_string(), "".to_string(), tx)
            .await?;

    let page_1_1_1 =
        InternalPageRepository::add(&Some(page_1_1.id), "1-1-1".to_string(), "".to_string(), tx)
            .await?;

    let page_1_1_2 =
        InternalPageRepository::add(&Some(page_1_1.id), "1-1-2".to_string(), "".to_string(), tx)
            .await?;

    Ok([
        page_1, page_2, page_1_1, page_1_2, page_2_1, page_2_2, page_1_1_1, page_1_1_2,
    ])
}

#[allow(dead_code)]
pub async fn seed_mock() -> anyhow::Result<()> {
    let mut tx = create_pool().await.begin().await?;

    insert_mock(&mut tx).await?;

    tx.commit().await?;

    Ok(())
}
