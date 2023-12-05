macro_rules! define_id {
    ($struct_name:ident, $id:path) => {
        #[derive(Debug, sqlx::Type)]
        #[sqlx(transparent)]
        pub struct $struct_name(pub uuid::Uuid);

        impl From<$struct_name> for $id {
            fn from(value: $struct_name) -> Self {
                Self(value.0)
            }
        }
    };
}

macro_rules! define_name {
    ($struct_name:ident, $name:path) => {
        #[derive(sqlx::Type)]
        #[sqlx(transparent)]
        pub struct $struct_name(pub String);

        impl From<$struct_name> for $name {
            fn from(value: $struct_name) -> Self {
                Self(value.0)
            }
        }
    };
}
