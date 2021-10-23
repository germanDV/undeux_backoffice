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

	// Create middleware chain
	// TODO: add rate limiting?
	generalMdw := alice.New(handler.Logger, handler.SecurityHeaders, handler.RecoverPanic)

	// API Routes: Other
	r.HandlerFunc(http.MethodGet, "/api/health", handlers.Health)

	// API Routes: Users
	r.HandlerFunc(
		http.MethodPost,
		"/api/login",
		users.Controller.Login,
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/me",
		users.Controller.Auth("user", users.Controller.Me),
	)
	r.HandlerFunc(
		http.MethodPost,
		"/api/register",
		users.Controller.Auth("admin", users.Controller.Register),
	)

	// Static assets
	r.NotFound = http.FileServer(http.Dir(filepath.Join(".", "web")))

	return generalMdw.Then(r)
}
