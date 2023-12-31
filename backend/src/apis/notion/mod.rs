mod page;

use self::page::{PageMutation, PageQuery};
use async_graphql::MergedObject;

#[derive(Default, MergedObject)]
pub struct NotionQueryRoot(PageQuery);

#[derive(Default, MergedObject)]
pub struct NotionMutationRoot(PageMutation);
