#![cfg(test)]

use super::{
    super::super::create_pool,
    mock::{insert_mock, InsertMockResponse},
    *,
};
use sqlx::{Executor, Postgres, Transaction};
use std::collections::{HashMap, HashSet};

async fn setup<'a>() -> anyhow::Result<(InsertMockResponse, Transaction<'a, Postgres>)> {
    let mut tx = create_pool().await.begin().await?;

    let insert_mock_response = insert_mock(&mut tx).await?;

    Ok((insert_mock_response, tx))
}

async fn teardown(tx: Transaction<'_, Postgres>) -> anyhow::Result<()> {
    tx.rollback().await?;

    Ok(())
}

async fn get_page_relationships_map<'e, 'c: 'e, E>(
    executor: E,
) -> anyhow::Result<HashMap<models::notion::page::PageId, HashSet<models::notion::page::PageId>>>
where
    E: 'e + Executor<'c, Database = Postgres>,
{
    let page_relationships =
        query_as::<_, PageRelationship>("SELECT * FROM notion.page_relationships")
            .fetch_all(executor)
            .await?
            .into_iter()
            .map(Into::into)
            .collect::<Vec<models::notion::page::PageRelationship>>();
    let page_relationships_map =
        page_relationships
            .iter()
            .fold(HashMap::new(), |mut acc, page_relationship| {
                acc.entry(page_relationship.ancestor)
                    .or_insert_with(HashSet::new)
                    .insert(page_relationship.descendant);
                acc
            });

    Ok(page_relationships_map)
}

async fn get_page_sibling_relationships_map<'e, 'c: 'e, E>(
    executor: E,
) -> anyhow::Result<HashMap<models::notion::page::PageId, HashSet<models::notion::page::PageId>>>
where
    E: 'e + Executor<'c, Database = Postgres>,
{
    let page_sibling_relationships =
        query_as::<_, PageRelationship>("SELECT * FROM notion.page_sibling_relationships")
            .fetch_all(executor)
            .await?
            .into_iter()
            .map(Into::into)
            .collect::<Vec<models::notion::page::PageRelationship>>();
    let page_sibling_relationships_map = page_sibling_relationships.iter().fold(
        HashMap::new(),
        |mut acc, page_sibling_relationship| {
            acc.entry(page_sibling_relationship.ancestor)
                .or_insert_with(HashSet::new)
                .insert(page_sibling_relationship.descendant);
            acc
        },
    );

    Ok(page_sibling_relationships_map)
}

#[tokio::test]
async fn find_roots_should_success() -> anyhow::Result<()> {
    let (
        InsertMockResponse {
            page_1,
            page_2,
            page_3,
            page_1_1: _,
            page_1_2: _,
            page_1_3: _,
            page_1_1_1: _,
        },
        mut tx,
    ) = setup().await?;

    let pages = InternalPageRepository::find_roots(&mut tx).await?;
    assert_eq!(
        pages.into_iter().map(|p| p.id).collect::<Vec<_>>(),
        vec![page_1.id, page_2.id, page_3.id]
    );

    teardown(tx).await?;

    Ok(())
}

#[tokio::test]
async fn find_children_should_success() -> anyhow::Result<()> {
    let (
        InsertMockResponse {
            page_1,
            page_2: _,
            page_3: _,
            page_1_1,
            page_1_2,
            page_1_3,
            page_1_1_1: _,
        },
        mut tx,
    ) = setup().await?;

    let pages = InternalPageRepository::find_children(&page_1.id, &mut tx).await?;
    assert_eq!(
        pages.into_iter().map(|p| p.id).collect::<Vec<_>>(),
        vec![page_1_1.id, page_1_2.id, page_1_3.id]
    );

    teardown(tx).await?;

    Ok(())
}

#[tokio::test]
async fn find_ancestors_should_success() -> anyhow::Result<()> {
    let (
        InsertMockResponse {
            page_1,
            page_2: _,
            page_3: _,
            page_1_1,
            page_1_2: _,
            page_1_3: _,
            page_1_1_1,
        },
        mut tx,
    ) = setup().await?;

    let pages = InternalPageRepository::find_ancestors(&page_1_1_1.id, &mut tx).await?;
    assert_eq!(
        pages.into_iter().map(|p| p.id).collect::<Vec<_>>(),
        vec![page_1.id, page_1_1.id]
    );

    teardown(tx).await?;

    Ok(())
}

#[tokio::test]
async fn find_descendants_should_success() -> anyhow::Result<()> {
    let (
        InsertMockResponse {
            page_1,
            page_2: _,
            page_3: _,
            page_1_1,
            page_1_2,
            page_1_3,
            page_1_1_1,
        },
        mut tx,
    ) = setup().await?;

    let (pages, page_relationships) =
        InternalPageRepository::find_descendants(&page_1.id, &mut tx).await?;
    assert_eq!(
        pages.into_iter().map(|p| p.id).collect::<Vec<_>>(),
        vec![
            page_1.id,
            page_1_1.id,
            page_1_2.id,
            page_1_3.id,
            page_1_1_1.id,
        ]
    );
    assert_eq!(
        page_relationships.into_iter().collect::<Vec<_>>(),
        vec![
            models::notion::page::PageRelationship {
                ancestor: page_1.id,
                descendant: page_1_1.id,
                weight: 1
            },
            models::notion::page::PageRelationship {
                ancestor: page_1.id,
                descendant: page_1_2.id,
                weight: 1
            },
            models::notion::page::PageRelationship {
                ancestor: page_1.id,
                descendant: page_1_3.id,
                weight: 1
            },
            models::notion::page::PageRelationship {
                ancestor: page_1_1.id,
                descendant: page_1_1_1.id,
                weight: 1
            },
        ]
    );

    teardown(tx).await?;

    Ok(())
}

#[tokio::test]
async fn add_should_success() -> anyhow::Result<()> {
    let (
        InsertMockResponse {
            page_1,
            page_2,
            page_3,
            page_1_1,
            page_1_2,
            page_1_3,
            page_1_1_1,
        },
        mut tx,
    ) = setup().await?;

    let page_relationships_map = get_page_relationships_map(&mut tx).await?;
    assert_eq!(
        &HashSet::from([
            page_1.id,
            page_1_1.id,
            page_1_2.id,
            page_1_3.id,
            page_1_1_1.id
        ]),
        page_relationships_map.get(&page_1.id).unwrap()
    );
    let page_sibling_relationships_map = get_page_sibling_relationships_map(&mut tx).await?;
    assert_eq!(
        &HashSet::from([page_1.id, page_2.id, page_3.id]),
        page_sibling_relationships_map.get(&page_1.id).unwrap()
    );

    teardown(tx).await?;

    Ok(())
}

#[tokio::test]
async fn remove_should_success() -> anyhow::Result<()> {
    // let (
    //     InsertMockResponse {
    //         page_1,
    //         page_2,
    //         page_3,
    //         page_1_1,
    //         page_1_2,
    //         page_1_3,
    //         page_1_1_1,
    //     },
    //     mut tx,
    // ) = setup().await?;

    // InternalPageRepository::remove(&page_1_1.id, &mut tx).await?;

    // TODO

    // teardown(tx).await?;

    Ok(())
}

#[tokio::test]
async fn move_should_success() -> anyhow::Result<()> {
    // let (
    //     InsertMockResponse {
    //         page_1,
    //         page_2,
    //         page_3,
    //         page_1_1,
    //         page_1_2,
    //         page_1_3,
    //         page_1_1_1,
    //     },
    //     mut tx,
    // ) = setup().await?;

    // InternalPageRepository::move_(&page_1_1.id, &page_1.id, &mut tx).await?;

    // TODO

    // teardown(tx).await?;

    Ok(())
}
