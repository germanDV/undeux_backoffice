# Undeux Backoffice

## Tech

- Backend: Go.
- Frontend: React w/typescript (_create-react-app_).
- DDBB: PostgreSQL.
- Hosting: Heroku.
- Deployment: single Docker image.
- Arch: monorepo, Go serves the React app and the REST API.

## Run

Back-End:
```shell
$ cd backend
$ go run .
```

Front-End:
```shell
$ cd frontend
$ yarn start
```

## Run w/Docker

```shell
$ make docker/build
$ make docker/local
```

## Env Vars

For _development_, env vars are supplied through an `.env` file. For _production_, these variables will be set in Heroku.

## Database Migrations

For database migrations, [migrate](https://github.com/golang-migrate/migrate) is being used.

Create **up** and **down** files for creating a table:
```shell
migrate create -seq -ext=.sql -dir=./migrations create_users_table
```

Run all migrations:
```shell
migrate -path ./migrations -database "postgres://postgres:esonoesharinasa@localhost/undeux?sslmode=disable" up
```

Get Postgres connection URL from heroku:
```shell
heroku pg:credentials:url
```

## Local Postgres For Development

Create docker image:
```shell
$ docker run --name pgdb-undeux -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=esonoesharinasa -e POSTGRES_DB=undeux -p 5432:5432 -d postgres
```

## Deployment

If any database migrations are needed, run those first with `migrate` (the postgres connection URL can be obtained with the heroku CLI).

Then just push code to the `heroku` remote:
```shell
git push heroku main
```

The docker image will be built on heroku and released.
