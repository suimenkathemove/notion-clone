FROM rust:1.75.0

WORKDIR /app

RUN set -x \
  && rustup component add \
  clippy \
  rustfmt \
  && cargo install \
  cargo-watch@8.4.1 \
  sqlx-cli@0.7.1 \
  cargo-nextest@0.9.63
