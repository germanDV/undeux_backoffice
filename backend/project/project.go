package project

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
	Update(w http.ResponseWriter, r *http.Request)
}

type iModel interface {
	Save(project *Project) error
	Get() ([]*Project, error)
	Update(pu *ProjectUpdate) error
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := projectModel{DB: db}
	controller := projectController{Model: model, L: l}

	return &Module{
		Model:      model,
		Controller: controller,
	}
}
