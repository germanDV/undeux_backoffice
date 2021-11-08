package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/constructoraundeux/backoffice/customer"
	"github.com/constructoraundeux/backoffice/handlers"
	"github.com/constructoraundeux/backoffice/shareholder"
	vendor "github.com/constructoraundeux/backoffice/supplier"
	"github.com/constructoraundeux/backoffice/user"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func routes(db *sql.DB, l *log.Logger) http.Handler {
	// Create router
	r := httprouter.New()

	// Instantiate modules
	handler := &handlers.Handler{L: l}
	users := user.New(db, l)
	shareholders := shareholder.New(db, l)
	vendors := vendor.New(db, l)
	customers := customer.New(db, l)

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
	r.HandlerFunc(
		http.MethodGet,
		"/api/users",
		users.Controller.Auth("admin", users.Controller.All),
	)
	r.HandlerFunc(
		http.MethodPut,
		"/api/users/upgrade",
		users.Controller.Auth("admin", users.Controller.Upgrade),
	)
	r.HandlerFunc(
		http.MethodPut,
		"/api/users/status",
		users.Controller.Auth("admin", users.Controller.ChangeStatus),
	)
	r.HandlerFunc(
		http.MethodPut,
		"/api/users/change-user-password",
		users.Controller.Auth("admin", users.Controller.ChangeUserPassword),
	)
	r.HandlerFunc(
		http.MethodPut,
		"/api/users/change-my-password",
		users.Controller.Auth("user", users.Controller.ChangeMyPassword),
	)

	// API Routes: Shareholders
	r.HandlerFunc(
		http.MethodPost,
		"/api/shareholders",
		users.Controller.Auth("admin", shareholders.Controller.Create),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/shareholders",
		users.Controller.Auth("admin", shareholders.Controller.List),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/shareholders/:id",
		users.Controller.Auth("admin", shareholders.Controller.Find),
	)

	// API Routes: Vendors
	r.HandlerFunc(
		http.MethodPost,
		"/api/vendors",
		users.Controller.Auth("admin", vendors.Controller.Create),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/vendors",
		users.Controller.Auth("admin", vendors.Controller.List),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/vendors/:id",
		users.Controller.Auth("admin", vendors.Controller.Find),
	)

	// API Routes: Customer
	r.HandlerFunc(
		http.MethodPost,
		"/api/customers",
		users.Controller.Auth("admin", customers.Controller.Create),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/customers",
		users.Controller.Auth("admin", customers.Controller.List),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/customers/:id",
		users.Controller.Auth("admin", customers.Controller.Find),
	)

	// Static assets and index.html
	r.NotFound = http.HandlerFunc(handlers.SpaHandler)

	return generalMdw.Then(r)
}
