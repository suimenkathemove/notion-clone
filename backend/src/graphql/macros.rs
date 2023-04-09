macro_rules! define_id {
    ($struct_name: ident, $id: path) => {
        #[derive(Clone, Copy, serde::Serialize, serde::Deserialize)]
        pub struct $struct_name(pub uuid::Uuid);

        impl From<$id> for $struct_name {
            fn from(id: $id) -> Self {
                Self(id.0)
            }
        }

        impl Into<$id> for $struct_name {
            fn into(self) -> $id {
                $id(self.0)
            }
        }

        async_graphql::scalar!($struct_name);
    };
}

macro_rules! define_name {
    ($struct_name: ident, $name: path) => {
        #[derive(Clone, serde::Serialize, serde::Deserialize)]
        pub struct $struct_name(pub String);

        impl From<$name> for $struct_name {
            fn from(name: $name) -> Self {
                Self(name.0)
            }
        }

        impl Into<$name> for $struct_name {
            fn into(self) -> $name {
                $name(self.0)
            }
        }

        async_graphql::scalar!($struct_name);
    };
}
