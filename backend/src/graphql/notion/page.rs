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

define_result!(GetPageResult, Page);

define_result!(CreatePageResult, Page);

#[derive(Default)]
pub struct PageQuery;

#[Object]
impl PageQuery {
    async fn list_page(&self, ctx: &Context<'_>) -> ListPageResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.list().await;
        match result {
            Ok(pages) => ListPageResult::Ok(ListPage {
                items: pages.into_iter().map(|p| p.into()).collect(),
            }),
            Err(error) => ListPageResult::Err(GraphQLError { code: error.into() }),
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
    async fn create_page(
        &self,
        ctx: &Context<'_>,
        title: String,
        text: String,
    ) -> CreatePageResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.create(title, text).await;
        match result {
            Ok(page) => CreatePageResult::Ok(page.into()),
            Err(error) => CreatePageResult::Err(GraphQLError { code: error.into() }),
        }
    }
}
