mod hello_world;

use self::hello_world::HelloWorldQuery;
use async_graphql::MergedObject;

#[derive(Default, MergedObject)]
pub struct NotionQueryRoot(HelloWorldQuery);
