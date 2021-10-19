package data

import (
	"context"
	"database/sql"
	"github.com/go-playground/validator/v10"
	"strings"
	"time"
)

type User struct {
	ID            int    `json:"id"`
	Email         string `json:"email" validate:"required,email"`
	Name          string `json:"name" validate:"required,min=2,max=32"`
	Role          string `json:"role" validate:"required,role"`
	Active        bool   `json:"active"`
	PasswordPlain string `json:"password,omitempty" validate:"required,min=12,max=32"`
	PasswordHash  []byte `json:"-"`
}

func validateRole(fl validator.FieldLevel) bool {
	value := strings.ToLower(fl.Field().String())
	return value == "user" || value == "admin" || value == "god"
}

func (u *User) Validate() error {
	validate := validator.New()
	err := validate.RegisterValidation("role", validateRole)
	if err != nil {
		return err
	}
	return validate.Struct(u)
}

func (u *User) Save(db *sql.DB) error {
	u.PasswordHash = []byte("working_on_it-" + u.PasswordPlain)

	query := `
		insert into users (name, email, password, role)
		values ($1, $2, $3, $4)
		returning id
	`

	args := []interface{}{u.Name, u.Email, u.PasswordHash, u.Role}
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	err := db.QueryRowContext(ctx, query, args...).Scan(&u.ID)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"`:
			return ErrDuplicateEmail
		default:
			return err
		}
	}

	return nil
}
