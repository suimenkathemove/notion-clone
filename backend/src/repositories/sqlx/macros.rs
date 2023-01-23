macro_rules! define_id {
    ($struct_name: ident, $id: path) => {
        #[derive(sqlx::Type)]
        #[sqlx(transparent)]
        pub struct $struct_name(pub Uuid);

        impl Into<$id> for $struct_name {
            fn into(self) -> $id {
                $id(self.0)
            }
        }
    };
}
