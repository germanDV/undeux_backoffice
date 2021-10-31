## help: print this help message.
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'

.PHONY: confirm
confirm:
	@echo -n 'Are you sure? [y/N]' && read ans && [ $${ans:-N} = y ]

## docker/build: build docker image ready for deployment.
.PHONY: docker/build
docker/build: confirm
	@echo 'Creating docker image...'
	docker build -t undeux-backoffice .

## docker/local: run docker image locally (port 3000).
.PHONY: docker/local
docker/local:
	@echo 'Running docker image locally...'
	docker run \
	  --env-file ./backend/.env \
	  -e ENV \
	  -e PORT \
  	  -e JWT_SECRET \
  	  -e DATABASE_URL \
	  --network="host" \
	  undeux-backoffice

## audit: tidy dependencies, format, vet and test
.PHONY: audit
audit:
	@echo 'Tidying and verifying module dependencies...'
	cd ./backend && go mod tidy
	cd ./backend && go mod verify
	@echo 'Formatting code...'
	cd ./backend && go fmt ./...
	@echo 'Vetting code...'
	cd ./backend && go vet ./...
	@echo 'Running tests...'
	cd ./backend && go test -race -vet=off ./...

