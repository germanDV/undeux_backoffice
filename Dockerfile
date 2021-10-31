# Go server
FROM golang:latest AS builder
ADD . /app
WORKDIR /app/backend
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .

# React app
FROM node:14-alpine AS node_builder
COPY --from=builder /app/frontend ./
RUN yarn install
RUN yarn run build

# Final build
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /main ./
COPY --from=node_builder /build ./web
RUN chmod +x ./main
EXPOSE 8080
CMD ./main
