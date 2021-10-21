package main

import (
	"database/sql"
	"github.com/constructoraundeux/backoffice/handlers"
	"github.com/constructoraundeux/backoffice/user"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"net/http"
	"path/filepath"
)

func routes(db *sql.DB) http.Handler {
	// Create router
	r := httprouter.New()

	// Create middleware chains
	generalMdw := alice.New(
		handlers.Logger,
		handlers.SecurityHeaders,
		handlers.RecoverPanic,
	)

	// Instantiate modules
	users := user.New(db)

	// API Routes: Other
	r.HandlerFunc(http.MethodGet, "/api/health", handlers.Health)

	// API Routes: Auth
	r.HandlerFunc(http.MethodPost, "/api/login", users.Controller.Login)
	r.HandlerFunc(http.MethodPost, "/api/register", users.Controller.Register)
	r.HandlerFunc(http.MethodGet, "/api/me", users.Controller.Me)

	// Static assets
	r.NotFound = http.FileServer(http.Dir(filepath.Join(".", "web")))

	return generalMdw.Then(r)
}

