ifndef VERBOSE
.SILENT:
endif

.PHONY: run
run:
	cd docker && docker compose up --build

name =

.PHONY: migrate-add
migrate-add:
	cd docker && docker compose run --rm app \
	sh -c "sqlx migrate add $(name)"
