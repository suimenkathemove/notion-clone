CREATE SCHEMA notion;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE notion.workspaces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE notion.accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE notion.roles (role VARCHAR(20) PRIMARY KEY);

INSERT INTO
    notion.roles (role)
VALUES
    ('OWNER'),
    ('MEMBER'),
    ('GUEST');

CREATE TABLE notion.pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    workspace_id UUID NOT NULL REFERENCES notion.workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES notion.accounts(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE notion.page_relationships (
    ancestor UUID NOT NULL REFERENCES notion.pages(id) ON DELETE CASCADE,
    descendant UUID NOT NULL REFERENCES notion.pages(id) ON DELETE CASCADE,
    weight INTEGER NOT NULL CHECK (weight >= 0),
    PRIMARY KEY (ancestor, descendant)
);

CREATE TABLE notion.page_sibling_relationships (
    ancestor UUID NOT NULL REFERENCES notion.pages(id) ON DELETE CASCADE,
    descendant UUID NOT NULL REFERENCES notion.pages(id) ON DELETE CASCADE,
    weight INTEGER NOT NULL CHECK (weight >= 0),
    PRIMARY KEY (ancestor, descendant)
);

CREATE TABLE notion.workspace_accounts (
    workspace_id UUID NOT NULL REFERENCES notion.workspaces(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES notion.accounts(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL REFERENCES notion.roles(role) ON UPDATE CASCADE,
    PRIMARY KEY (workspace_id, account_id)
);

CREATE TABLE notion.page_assignees (
    page_id UUID NOT NULL REFERENCES notion.pages(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES notion.accounts(id) ON DELETE CASCADE,
    PRIMARY KEY (page_id, account_id)
);
