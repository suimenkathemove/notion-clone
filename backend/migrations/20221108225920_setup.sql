CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE dms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL
);
