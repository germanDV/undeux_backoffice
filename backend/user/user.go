package user

import (
	"database/sql"
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
}

type iModel interface {
	Save(user *User) error
	GetByEmail(email string) (*User, error)
}

func New(db *sql.DB) *Module {
	model := userModel{DB: db}
	controller := userController{Model: model}
	return &Module{
		Model: model,
		Controller: controller,
	}
}
