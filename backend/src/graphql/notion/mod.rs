mod hello_world;
mod page;

use self::{
    hello_world::HelloWorldQuery,
    page::{PageMutation, PageQuery},
};
use async_graphql::MergedObject;

#[derive(Default, MergedObject)]
pub struct NotionQueryRoot(HelloWorldQuery, PageQuery);

#[derive(Default, MergedObject)]
pub struct NotionMutationRoot(PageMutation);
