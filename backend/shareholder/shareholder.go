package shareholder

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
	Save(shareholder *Shareholder) error
	Get() ([]*Shareholder, error)
	GetByID(id int) (*Shareholder, error)
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := shareholderModel{DB: db}
	controller := shareholderController{Model: model, L: l}

	return &Module{
		Model:      model,
		Controller: controller,
	}
}
