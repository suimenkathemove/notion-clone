use super::super::{error::GraphQLError, utils::DateTimeUtc};
use crate::use_cases::notion::page::PageUseCase;
use async_graphql::{Context, Object, SimpleObject};

define_id!(PageId, models::notion::page::PageId);

pub struct Page {
    pub id: PageId,
    pub title: String,
    pub text: String,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

impl From<models::notion::page::Page> for Page {
    fn from(page: models::notion::page::Page) -> Self {
        Self {
            id: page.id.into(),
            title: page.title,
            text: page.text,
            created_at: page.created_at.into(),
            updated_at: page.updated_at.into(),
        }
    }
}

#[Object]
impl Page {
    async fn id(&self) -> &PageId {
        &self.id
    }

    async fn title(&self) -> &str {
        &self.title
    }

    async fn text(&self) -> &str {
        &self.text
    }

    async fn created_at(&self) -> &DateTimeUtc {
        &self.created_at
    }

    async fn updated_at(&self) -> &DateTimeUtc {
        &self.updated_at
    }
}

#[derive(SimpleObject)]
struct ListPage {
    items: Vec<Page>,
}

define_result!(ListPageResult, ListPage);

define_result!(ListDescendantPageResult, ListPage);

define_result!(ListChildrenPageResult, ListPage);

define_result!(GetPageResult, Page);

define_result!(AddPageResult, Page);

#[derive(SimpleObject)]
struct RemovePage {
    id: PageId,
}

define_result!(RemovePageResult, RemovePage);

#[derive(SimpleObject)]
struct MovePage {
    id: PageId,
}

define_result!(MovePageResult, MovePage);

#[derive(Default)]
pub struct PageQuery;

#[Object]
impl PageQuery {
    async fn list_page(&self, ctx: &Context<'_>) -> ListPageResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.list().await;
        match result {
            Ok(pages) => ListPageResult::Ok(ListPage {
                items: pages.into_iter().map(Into::into).collect(),
            }),
            Err(error) => ListPageResult::Err(GraphQLError { code: error.into() }),
        }
    }

    async fn list_descendant_page(
        &self,
        ctx: &Context<'_>,
        parent_id: PageId,
    ) -> ListDescendantPageResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.descendants(&parent_id.into()).await;
        match result {
            Ok(pages) => ListDescendantPageResult::Ok(ListPage {
                items: pages.into_iter().map(Into::into).collect(),
            }),
            Err(error) => ListDescendantPageResult::Err(GraphQLError { code: error.into() }),
        }
    }

    async fn list_children_page(
        &self,
        ctx: &Context<'_>,
        parent_id: PageId,
    ) -> ListChildrenPageResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.children(&parent_id.into()).await;
        match result {
            Ok(pages) => ListChildrenPageResult::Ok(ListPage {
                items: pages.into_iter().map(Into::into).collect(),
            }),
            Err(error) => ListChildrenPageResult::Err(GraphQLError { code: error.into() }),
        }
    }

    async fn get_page(&self, ctx: &Context<'_>, id: PageId) -> GetPageResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.get(&id.into()).await;
        match result {
            Ok(page) => GetPageResult::Ok(page.into()),
            Err(error) => GetPageResult::Err(GraphQLError { code: error.into() }),
        }
    }
}

#[derive(Default)]
pub struct PageMutation;

#[Object]
impl PageMutation {
    async fn add_page(
        &self,
        ctx: &Context<'_>,
        parent_id: Option<PageId>,
        title: String,
        text: String,
    ) -> AddPageResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case
            .add(&parent_id.map(Into::into), title, text)
            .await;
        match result {
            Ok(page) => AddPageResult::Ok(page.into()),
            Err(error) => AddPageResult::Err(GraphQLError { code: error.into() }),
        }
    }

    async fn remove_page(&self, ctx: &Context<'_>, id: PageId) -> RemovePageResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.remove(&id.into()).await;
        match result {
            Ok(_) => RemovePageResult::Ok(RemovePage { id }),
            Err(error) => RemovePageResult::Err(GraphQLError { code: error.into() }),
        }
    }

    async fn move_page(
        &self,
        ctx: &Context<'_>,
        id: PageId,
        to_parent_id: PageId,
    ) -> MovePageResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.move_(&id.into(), &to_parent_id.into()).await;
        match result {
            Ok(_) => MovePageResult::Ok(MovePage { id }),
            Err(error) => MovePageResult::Err(GraphQLError { code: error.into() }),
        }
    }
}
