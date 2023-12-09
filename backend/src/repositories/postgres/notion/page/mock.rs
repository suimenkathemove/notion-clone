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

pub(super) async fn insert_mock<'a>(
) -> anyhow::Result<(InsertMockResponse, Transaction<'a, Postgres>)> {
    let mut tx = create_pool().await.begin().await?;

    let page_1 = InternalPageRepository::add(
        &None::<models::notion::page::PageId>,
        models::notion::page::PageContent {
            title: "1".to_string(),
            ..Default::default()
        },
        &mut tx,
    )
    .await?;

    let page_2 = InternalPageRepository::add(
        &None::<models::notion::page::PageId>,
        models::notion::page::PageContent {
            title: "2".to_string(),
            ..Default::default()
        },
        &mut tx,
    )
    .await?;

    let page_3 = InternalPageRepository::add(
        &None::<models::notion::page::PageId>,
        models::notion::page::PageContent {
            title: "3".to_string(),
            ..Default::default()
        },
        &mut tx,
    )
    .await?;

    let page_1_1 = InternalPageRepository::add(
        &Some(page_1.id),
        models::notion::page::PageContent {
            title: "1-1".to_string(),
            ..Default::default()
        },
        &mut tx,
    )
    .await?;

    let page_1_2 = InternalPageRepository::add(
        &Some(page_1.id),
        models::notion::page::PageContent {
            title: "1-2".to_string(),
            ..Default::default()
        },
        &mut tx,
    )
    .await?;

    let page_1_3 = InternalPageRepository::add(
        &Some(page_1.id),
        models::notion::page::PageContent {
            title: "1-3".to_string(),
            ..Default::default()
        },
        &mut tx,
    )
    .await?;

    let page_1_1_1 = InternalPageRepository::add(
        &Some(page_1_1.id),
        models::notion::page::PageContent {
            title: "1-1-1".to_string(),
            ..Default::default()
        },
        &mut tx,
    )
    .await?;

    Ok((
        InsertMockResponse {
            page_1,
            page_2,
            page_3,
            page_1_1,
            page_1_2,
            page_1_3,
            page_1_1_1,
        },
        tx,
    ))
}

#[allow(dead_code)]
pub async fn seed_mock() -> anyhow::Result<()> {
    let (_, tx) = insert_mock().await?;

    tx.commit().await?;

    Ok(())
}
