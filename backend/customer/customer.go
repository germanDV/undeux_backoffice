package customer

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
	Create(w http.ResponseWriter, r *http.Request)
	List(w http.ResponseWriter, r *http.Request)
	Find(w http.ResponseWriter, r *http.Request)
}

type iModel interface {
	Save(customer *Customer) error
	Get() ([]*Customer, error)
	GetByID(id int) (*Customer, error)
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := customerModel{DB: db}
	controller := customerController{Model: model, L: l}

	return &Module{
		Model:      model,
		Controller: controller,
	}
}
