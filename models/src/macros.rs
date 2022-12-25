macro_rules! define_id {
    ($name: ident) => {
        use uuid::Uuid;

        pub struct $name(pub Uuid);
    };
}
