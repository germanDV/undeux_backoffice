package vendor

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
	Save(vendor *Vendor) error
	Get() ([]*Vendor, error)
	GetByID(id int) (*Vendor, error)
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := vendorModel{DB: db}
	controller := vendorController{Model: model, L: l}

	return &Module{
		Model:      model,
		Controller: controller,
	}
}
