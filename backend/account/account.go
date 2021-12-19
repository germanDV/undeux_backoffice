package account

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
	List(w http.ResponseWriter, r *http.Request)
}

type iModel interface {
	Get() ([]*Account, error)
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := accountModel{DB: db}
	controller := accountController{Model: model, L: l}

	return &Module{
		Model:      model,
		Controller: controller,
	}
}
