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
	Auth(role string, next http.HandlerFunc) http.HandlerFunc
	All(w http.ResponseWriter, r *http.Request)
	Upgrade(w http.ResponseWriter, r *http.Request)
	ChangeStatus(w http.ResponseWriter, r *http.Request)
	ChangeMyPassword(w http.ResponseWriter, r *http.Request)
	ChangeUserPassword(w http.ResponseWriter, r *http.Request)
}

type iModel interface {
	Save(user *User) error
	GetByEmail(email string) (*User, error)
	GetByID(id int) (*User, error)
	GetAll() ([]*User, error)
	MakeAdmin(id int) error
	ChangeActiveStatus(id int, active bool) error
	ChangePassword(id int, password string) error
}

func New(db *sql.DB, l *log.Logger) *Module {
	model := userModel{DB: db}
	controller := userController{Model: model, L: l}

	return &Module{
		Model: model,
		Controller: controller,
	}
}
