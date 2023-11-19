CREATE SCHEMA notion;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE notion.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notion.page_tree_paths (
    PRIMARY KEY (ancestor, descendant),
    ancestor UUID NOT NULL REFERENCES notion.pages(id) ON DELETE CASCADE,
    descendant UUID NOT NULL REFERENCES notion.pages(id) ON DELETE CASCADE,
    weight INTEGER NOT NULL
);
