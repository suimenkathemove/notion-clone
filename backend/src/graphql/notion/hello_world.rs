use async_graphql::Object;

#[derive(Default)]
pub struct HelloWorldQuery;

#[Object]
impl HelloWorldQuery {
    async fn hello_world(&self) -> &str {
        "Hello, World!"
    }
}
