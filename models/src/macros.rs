macro_rules! define_id {
    ($name: ident) => {
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
        pub struct $name(pub uuid::Uuid);
    };
}

macro_rules! define_name {
    ($name: ident) => {
        pub struct $name(pub String);

        impl std::str::FromStr for $name {
            type Err = std::string::ParseError;

            fn from_str(s: &str) -> Result<Self, Self::Err> {
                Ok(Self(s.to_string()))
            }
        }
    };
}
