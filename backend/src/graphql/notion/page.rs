use super::super::{common::DateTimeUtc, error::GraphQLError};
use crate::use_cases::notion::page::PageUseCase;
use async_graphql::{Context, Object, SimpleObject};

define_id!(PageId, models::notion::page::PageId);

struct Page {
    id: PageId,
    title: String,
    text: String,
    created_at: DateTimeUtc,
    updated_at: DateTimeUtc,
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

struct PageTree {
    id: PageId,
    title: String,
    text: String,
    created_at: DateTimeUtc,
    updated_at: DateTimeUtc,
    children: Vec<PageTree>,
}

impl From<models::notion::page::PageTree> for PageTree {
    fn from(value: models::notion::page::PageTree) -> Self {
        Self {
            id: value.id.into(),
            title: value.title,
            text: value.text,
            created_at: value.created_at.into(),
            updated_at: value.updated_at.into(),
            children: value.children.into_iter().map(Self::from).collect(),
        }
    }
}

#[Object]
impl PageTree {
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

    async fn children(&self) -> &Vec<PageTree> {
        &self.children
    }
}

#[derive(SimpleObject)]
struct ListPages {
    items: Vec<Page>,
}

define_result!(ListRootPagesResult, ListPages);

define_result!(ListChildrenPagesResult, ListPages);

define_result!(ListAncestorPagesResult, ListPages);

define_result!(ListDescendantPagesResult, PageTree);

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
    async fn list_root_pages(&self, ctx: &Context<'_>) -> ListRootPagesResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.list_roots().await;
        match result {
            Ok(pages) => ListRootPagesResult::Ok(ListPages {
                items: pages.into_iter().map(Into::into).collect(),
            }),
            Err(error) => ListRootPagesResult::Err(GraphQLError { code: error.into() }),
        }
    }

    async fn list_children_pages(&self, ctx: &Context<'_>, id: PageId) -> ListChildrenPagesResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.list_children(&id.into()).await;
        match result {
            Ok(pages) => ListChildrenPagesResult::Ok(ListPages {
                items: pages.into_iter().map(Into::into).collect(),
            }),
            Err(error) => ListChildrenPagesResult::Err(GraphQLError { code: error.into() }),
        }
    }

    async fn list_ancestor_pages(&self, ctx: &Context<'_>, id: PageId) -> ListAncestorPagesResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.list_ancestors(&id.into()).await;
        match result {
            Ok(pages) => ListAncestorPagesResult::Ok(ListPages {
                items: pages.into_iter().map(Into::into).collect(),
            }),
            Err(error) => ListAncestorPagesResult::Err(GraphQLError { code: error.into() }),
        }
    }

    async fn list_descendant_pages(
        &self,
        ctx: &Context<'_>,
        id: PageId,
    ) -> ListDescendantPagesResult {
        let page_use_case = ctx.data_unchecked::<PageUseCase>();
        let result = page_use_case.list_descendants(&id.into()).await;
        match result {
            Ok(page_tree) => ListDescendantPagesResult::Ok(page_tree.into()),
            Err(error) => ListDescendantPagesResult::Err(GraphQLError { code: error.into() }),
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
