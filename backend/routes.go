package main

import (
	"database/sql"
	"github.com/constructoraundeux/backoffice/handlers"
	"github.com/constructoraundeux/backoffice/user"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"log"
	"net/http"
	"path/filepath"
)

func routes(db *sql.DB, l *log.Logger) http.Handler {
	// Create router
	r := httprouter.New()

	// Instantiate modules
	handler := &handlers.Handler{L: l}
	users := user.New(db, l)

	// Create middleware chains
	generalMdw := alice.New(handler.Logger, handler.SecurityHeaders, handler.RecoverPanic)
	authMdw := alice.New(users.Controller.Auth)

	// API Routes: Other
	r.HandlerFunc(http.MethodGet, "/api/health", handlers.Health)

	// API Routes: Auth
	r.HandlerFunc(http.MethodPost, "/api/login", users.Controller.Login)
	r.HandlerFunc(http.MethodPost, "/api/register", users.Controller.Register)
	r.Handler(http.MethodGet, "/api/me", authMdw.ThenFunc(users.Controller.Me))

	// Static assets
	r.NotFound = http.FileServer(http.Dir(filepath.Join(".", "web")))

	return generalMdw.Then(r)
}

