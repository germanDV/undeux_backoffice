package main

import (
	"database/sql"
	"github.com/constructoraundeux/backoffice/fx"
	"log"
	"net/http"

	"github.com/constructoraundeux/backoffice/account"
	"github.com/constructoraundeux/backoffice/cash"
	"github.com/constructoraundeux/backoffice/customer"
	"github.com/constructoraundeux/backoffice/handlers"
	"github.com/constructoraundeux/backoffice/project"
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
	projects := project.New(db, l)
	bank := cash.New(db, l)
	accounts := account.New(db, l)
	rates := fx.New(db, l)

	// Create middleware chain
	generalMdw := alice.New(
		handler.Logger,
		handler.RateLimiter,
		handler.SecurityHeaders,
		handler.RecoverPanic,
	)

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
		users.Controller.Auth("user", vendors.Controller.Create),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/vendors",
		users.Controller.Auth("user", vendors.Controller.List),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/vendors/:id",
		users.Controller.Auth("user", vendors.Controller.Find),
	)

	// API Routes: Customer
	r.HandlerFunc(
		http.MethodPost,
		"/api/customers",
		users.Controller.Auth("user", customers.Controller.Create),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/customers",
		users.Controller.Auth("user", customers.Controller.List),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/customers/:id",
		users.Controller.Auth("user", customers.Controller.Find),
	)

	// API Routes: Project
	r.HandlerFunc(
		http.MethodPost,
		"/api/projects",
		users.Controller.Auth("user", projects.Controller.Create),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/projects",
		users.Controller.Auth("user", projects.Controller.List),
	)
	r.HandlerFunc(
		http.MethodPut,
		"/api/projects",
		users.Controller.Auth("user", projects.Controller.Update),
	)

	// API Routes: Cash / Bank
	r.HandlerFunc(
		http.MethodPost,
		"/api/cash/payments",
		users.Controller.Auth("user", bank.Controller.Pay),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/cash/payments",
		users.Controller.Auth("user", bank.Controller.ListPayments),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/cash/payments/:id",
		users.Controller.Auth("user", bank.Controller.FindPayment),
	)
	r.HandlerFunc(
		http.MethodDelete,
		"/api/cash/payments/:id",
		users.Controller.Auth("user", bank.Controller.DeletePayment),
	)
	r.HandlerFunc(
		http.MethodPost,
		"/api/cash/collections",
		users.Controller.Auth("user", bank.Controller.Collect),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/cash/collections",
		users.Controller.Auth("user", bank.Controller.ListCollections),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/cash/collections/:id",
		users.Controller.Auth("user", bank.Controller.FindCollection),
	)
	r.HandlerFunc(
		http.MethodDelete,
		"/api/cash/collections/:id",
		users.Controller.Auth("user", bank.Controller.DeleteCollection),
	)
	r.HandlerFunc(
		http.MethodPost,
		"/api/cash/investments",
		users.Controller.Auth("admin", bank.Controller.Invest),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/cash/investments",
		users.Controller.Auth("admin", bank.Controller.ListInvestments),
	)
	r.HandlerFunc(
		http.MethodDelete,
		"/api/cash/investments/:id",
		users.Controller.Auth("admin", bank.Controller.DeleteInvestment),
	)
	r.HandlerFunc(
		http.MethodPost,
		"/api/cash/dividends",
		users.Controller.Auth("admin", bank.Controller.PayDividend),
	)
	r.HandlerFunc(
		http.MethodGet,
		"/api/cash/dividends",
		users.Controller.Auth("admin", bank.Controller.ListDividends),
	)
	r.HandlerFunc(
		http.MethodDelete,
		"/api/cash/dividends/:id",
		users.Controller.Auth("admin", bank.Controller.DeleteDividend),
	)

	// API Routes: Accounts
	r.HandlerFunc(
		http.MethodGet,
		"/api/accounts",
		users.Controller.Auth("user", accounts.Controller.List),
	)

	// API Routes: FX
	r.HandlerFunc(
		http.MethodGet,
		"/api/fx",
		users.Controller.Auth("user", rates.Controller.Get),
	)
	r.HandlerFunc(
		http.MethodPost,
		"/api/fx",
		users.Controller.Auth("user", rates.Controller.Set),
	)

	// Static assets and index.html
	r.NotFound = http.HandlerFunc(handlers.SpaHandler)

	return generalMdw.Then(r)
}
