# monorepo-sandbox

## Overview

This repository is my monorepo sandbox containing backend, frontend, and infrastructure components.

## Projects

- **Notion Clone**: This is a [Notion](https://www.notion.so/) clone. (Under development)
- **Slack Clone**: This is a [Slack](https://slack.com/) clone. (Development paused)

## Technology Stacks

- **GraphQL**: For schema and API protocol.
- **Rust, Axum**: For backend development.
- **TypeScript, Next.js**: For frontend development.

## Setting up and running locally

### backend

To run backend server locally, and run

```sh
cd backend
# execute only once
makers init
makers dev
```

### frontend

Requires Node 20.x and pnpm 3+. To run frontend server locally, and run

```sh
cd frontend
# execute only once
pnpm install
pnpm run dev
```

## License

This is MIT licensed.
