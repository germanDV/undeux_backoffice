package fx

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
	Get(w http.ResponseWriter, r *http.Request)
	Set(w http.ResponseWriter, r *http.Request)
}

type iModel interface {
	Get() (*FX, error)
	Set(fx *FX) error
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := fxModel{DB: db}
	controller := fxController{Model: model, L: l}

	return &Module{
		Model:      model,
		Controller: controller,
	}
}
