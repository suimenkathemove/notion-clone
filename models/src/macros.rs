macro_rules! define_id {
    ($name: ident) => {
        use uuid::Uuid;

        pub struct $name(pub Uuid);
    };
}

macro_rules! define_name {
    ($name: ident) => {
        use std::{str::FromStr, string::ParseError};

        pub struct $name(pub String);

        impl FromStr for $name {
            type Err = ParseError;

            fn from_str(s: &str) -> Result<Self, Self::Err> {
                Ok(Self(s.to_string()))
            }
        }
    };
}
