package cash

import (
	"database/sql"
	"log"
	"net/http"
)

type Module struct {
	Controller iController
	Model      iModel
}

type iController interface {
	Pay(w http.ResponseWriter, r *http.Request)
	ListPayments(w http.ResponseWriter, r *http.Request)
	FindPayment(w http.ResponseWriter, r *http.Request)
	DeletePayment(w http.ResponseWriter, r *http.Request)
	Collect(w http.ResponseWriter, r *http.Request)
	ListCollections(w http.ResponseWriter, r *http.Request)
	FindCollection(w http.ResponseWriter, r *http.Request)
	DeleteCollection(w http.ResponseWriter, r *http.Request)
	Invest(w http.ResponseWriter, r *http.Request)
	ListInvestments(w http.ResponseWriter, r *http.Request)
	DeleteInvestment(w http.ResponseWriter, r *http.Request)
	PayDividend(w http.ResponseWriter, r *http.Request)
	ListDividends(w http.ResponseWriter, r *http.Request)
	DeleteDividend(w http.ResponseWriter, r *http.Request)
}

type iModel interface {
	Pay(pmnt *Payment) error
	GetPayments() ([]*Payment, error)
	GetPaymentByID(id int) (*Payment, error)
	DeletePayment(p *Payment) error
	Collect(c *Collection) error
	GetCollections() ([]*Collection, error)
	GetCollectionByID(id int) (*Collection, error)
	DeleteCollection(c *Collection) error
	Invest(i *Investment) error
	GetInvestments() ([]*Investment, error)
	GetInvestmentByID(id int) (*Investment, error)
	DeleteInvestment(i *Investment) error
	PayDividend(d *Dividend) error
	GetDividends() ([]*Dividend, error)
	GetDividendByID(id int) (*Dividend, error)
	DeleteDividend(d *Dividend) error
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := cashModel{DB: db}
	controller := cashController{Model: model, L: l}

	return &Module{
		Model:      model,
		Controller: controller,
	}
}
