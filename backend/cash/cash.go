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
}

type iModel interface {
	Pay(pmnt *Payment) error
	GetPayments() ([]*Payment, error)
	GetPaymentByID(id int) (*Payment, error)
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := cashModel{DB: db}
	controller := cashController{Model: model, L: l}

	return &Module{
		Model:      model,
		Controller: controller,
	}
}
