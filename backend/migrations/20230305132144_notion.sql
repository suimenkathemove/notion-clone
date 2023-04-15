CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE page_tree_paths (
    PRIMARY KEY (ancestor, descendant),
    ancestor UUID NOT NULL REFERENCES pages(id),
    descendant UUID NOT NULL REFERENCES pages(id)
);
