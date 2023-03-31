install:
	npm install
dev:
	npm run dev
build:
	docker compose build
up:
	docker compose up
prod:
	make build && make up
