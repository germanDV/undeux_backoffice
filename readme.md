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
