package main

import (
	"database/sql"
	"github.com/constructoraundeux/backoffice/handlers"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"path/filepath"
)

func routes(db *sql.DB) http.Handler {
	r := httprouter.New()
	controllers := handlers.Controller{DB: db}

	// API Routes: Other
	r.HandlerFunc(http.MethodGet, "/api/health", handlers.Health)

	// API Routes: Auth
	r.HandlerFunc(http.MethodPost, "/api/login", controllers.Login)
	r.HandlerFunc(http.MethodPost, "/api/register", controllers.Register)
	r.HandlerFunc(http.MethodGet, "/api/me", controllers.Me)

	// Static assets
	r.NotFound = http.FileServer(http.Dir(filepath.Join(".", "web")))

	return r
}

