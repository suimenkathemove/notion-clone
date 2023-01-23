macro_rules! define_id {
    ($struct_name: ident, $id: path) => {
        #[derive(Clone, Copy, Serialize, Deserialize)]
        pub struct $struct_name(pub Uuid);

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

        scalar!($struct_name);
    };
}

macro_rules! define_name {
    ($struct_name: ident, $name: path) => {
        #[derive(Clone, Serialize, Deserialize)]
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

        scalar!($struct_name);
    };
}
