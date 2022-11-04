FROM rust:1.65.0

WORKDIR /usr/src/backend
COPY . .

RUN cargo install --path .

CMD ["backend"]
