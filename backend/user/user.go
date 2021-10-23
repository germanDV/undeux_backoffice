package user

import (
	"database/sql"
	"log"
	"net/http"
)

type Module struct {
	Controller iController
	Model iModel
}

type iController interface {
	Login(w http.ResponseWriter, r *http.Request)
	Register(w http.ResponseWriter, r *http.Request)
	Me(w http.ResponseWriter, r *http.Request)
	Auth(next http.Handler) http.Handler
}

type iModel interface {
	Save(user *User) error
	GetByEmail(email string) (*User, error)
	GetByID(id int) (*User, error)
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := userModel{DB: db}
	controller := userController{Model: model, L: l}
	return &Module{
		Model: model,
		Controller: controller,
	}
}
