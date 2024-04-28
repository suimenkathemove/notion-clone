# ER図

```mermaid
erDiagram
  workspaces {
    uuid id PK
  }

  accounts {
    uuid id PK
  }

  pages {
    uuid id PK
    uuid workspace_id FK
    uuid created_by FK
  }

  workspace_accounts {
    uuid workspace_id PK,FK
    uuid account_id PK,FK
  }

  page_assignees {
    uuid page_id PK,FK
    uuid account_id PK,FK
  }
```
