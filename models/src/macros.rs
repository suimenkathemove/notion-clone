macro_rules! define_id {
    ($name: ident) => {
        use uuid::Uuid;

        pub struct $name(pub Uuid);
    };
}

macro_rules! define_name {
    ($name: ident) => {
        pub struct $name(pub String);
    };
}
