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
	  -p 3000:8080 \
	  undeux-backoffice

## deploy: deploy to Heroku.
.PHONY: deploy
deploy: confirm
	@echo 'Deploying to heroku (git push)...'
	git push heroku main
