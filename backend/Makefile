ifndef VERBOSE
.SILENT:
endif

name =

.PHONY: migrate-add
migrate-add:
	cd docker && docker compose run --rm app \
	sh -c "sqlx migrate add $(name)"

.PHONY: migrate-run
migrate-run:
	cd docker && docker compose run --rm app \
	sh -c "sqlx db create" \
	sh -c "sqlx migrate run"

.PHONY: run
run: migrate-run
	cd docker && docker compose up --build
