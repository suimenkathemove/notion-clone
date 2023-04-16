macro_rules! define_id {
    ($struct_name: ident, $id: path) => {
        #[derive(Debug, sqlx::Type)]
        #[sqlx(transparent)]
        pub struct $struct_name(pub uuid::Uuid);

        impl Into<$id> for $struct_name {
            fn into(self) -> $id {
                $id(self.0)
            }
        }
    };
}

macro_rules! define_name {
    ($struct_name: ident, $name: path) => {
        #[derive(sqlx::Type)]
        #[sqlx(transparent)]
        pub struct $struct_name(pub String);

        impl Into<$name> for $struct_name {
            fn into(self) -> $name {
                $name(self.0)
            }
        }
    };
}
