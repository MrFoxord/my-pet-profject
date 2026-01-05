# Multi-stage build for Go API
FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod .
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./main.go

FROM gcr.io/distroless/base-debian12

WORKDIR /app

COPY --from=builder /app/server ./server

# Cloud Run will set PORT; default 8080
ENV PORT=8080

EXPOSE 8080

CMD ["/app/server"]
