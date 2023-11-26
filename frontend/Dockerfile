FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /frontend

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .

CMD pnpm dev
