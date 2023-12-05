use super::InternalPageRepository;
use crate::repositories::postgres::create_pool;
use sqlx::{Postgres, Transaction};

pub struct InsertMockResponse {
    pub page_1: models::notion::page::Page,
    pub page_2: models::notion::page::Page,
    pub page_3: models::notion::page::Page,
    pub page_1_1: models::notion::page::Page,
    pub page_1_2: models::notion::page::Page,
    pub page_1_3: models::notion::page::Page,
    pub page_1_1_1: models::notion::page::Page,
}

pub(super) async fn insert_mock(
    tx: &mut Transaction<'_, Postgres>,
) -> anyhow::Result<InsertMockResponse> {
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

    let page_3 = InternalPageRepository::add(
        &None::<models::notion::page::PageId>,
        "3".to_string(),
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

    let page_1_3 =
        InternalPageRepository::add(&Some(page_1.id), "1-3".to_string(), "".to_string(), tx)
            .await?;

    let page_1_1_1 =
        InternalPageRepository::add(&Some(page_1_1.id), "1-1-1".to_string(), "".to_string(), tx)
            .await?;

    Ok(InsertMockResponse {
        page_1,
        page_2,
        page_3,
        page_1_1,
        page_1_2,
        page_1_3,
        page_1_1_1,
    })
}

#[allow(dead_code)]
pub async fn seed_mock() -> anyhow::Result<()> {
    let mut tx = create_pool().await.begin().await?;

    insert_mock(&mut tx).await?;

    tx.commit().await?;

    Ok(())
}
