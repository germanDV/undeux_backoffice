package user

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/constructoraundeux/backoffice/errs"
	"github.com/go-playground/validator/v10"
	"strings"
	"time"
)

type User struct {
	ID            int       `json:"id"`
	Email         string    `json:"email" validate:"required,email"`
	Name          string    `json:"name" validate:"required,min=2,max=32"`
	Role          string    `json:"role" validate:"required,role"`
	Active        bool      `json:"active"`
	PasswordPlain string    `json:"password,omitempty" validate:"required,min=12,max=32"`
	PasswordHash  []byte    `json:"-"`
	CreatedAt     time.Time `json:"createdAt"`
}

type UserLoginSubmission struct {
	Email         string `json:"email" validate:"required,email"`
	PasswordPlain string `json:"password,omitempty" validate:"required,min=12,max=32"`
}

type OwnPasswordChangeSubmission struct {
	OldPasswordPlain string `json:"oldPassword,omitempty" validate:"required,min=12,max=32"`
	NewPasswordPlain string `json:"newPassword,omitempty" validate:"required,min=12,max=32"`
}

type userModel struct {
	DB *sql.DB
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

func (uls *UserLoginSubmission) Validate() error {
	validate := validator.New()
	return validate.Struct(uls)
}

func (opcs *OwnPasswordChangeSubmission) Validate() error {
	validate := validator.New()
	return validate.Struct(opcs)
}

func (um userModel) Save(u *User) error {
	hashed, err := hash(u.PasswordPlain, 11)
	if err != nil {
		return err
	}
	u.PasswordHash = hashed

	query := `
		insert into users (name, email, password, role)
		values ($1, $2, $3, $4)
		returning id
	`

	args := []interface{}{u.Name, u.Email, u.PasswordHash, u.Role}
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	err = um.DB.QueryRowContext(ctx, query, args...).Scan(&u.ID)
	if err != nil {
		switch {
		case err.Error() == `pq: duplicate key value violates unique constraint "users_email_key"`:
			return errs.ErrDuplicateEmail
		default:
			return err
		}
	}

	return nil
}

func (um userModel) GetByEmail(email string) (*User, error) {
	query := `
		select id, created_at, name, email, role, password, active
		from users
		where email = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var user User
	err := um.DB.QueryRowContext(ctx, query, strings.ToLower(email)).Scan(
		&user.ID,
		&user.CreatedAt,
		&user.Name,
		&user.Email,
		&user.Role,
		&user.PasswordHash,
		&user.Active,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errs.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &user, nil
}

func (um userModel) GetByID(id int) (*User, error) {
	query := `
		select id, created_at, name, email, role, password, active
		from users
		where id = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var user User
	err := um.DB.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.CreatedAt,
		&user.Name,
		&user.Email,
		&user.Role,
		&user.PasswordHash,
		&user.Active,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errs.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &user, nil
}

func (um userModel) GetAll() ([]*User, error) {
	query := `
		select id, created_at, name, email, role, active
		from users
	`

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	rows, err := um.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User

	for rows.Next() {
		u := &User{}
		err := rows.Scan(&u.ID, &u.CreatedAt, &u.Name, &u.Email, &u.Role, &u.Active)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (um userModel) MakeAdmin(id int) error {
	query := `
		update users set role = 'admin'
		where id = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	result, err := um.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if affected != 1 {
		return errors.New(fmt.Sprintf("expected 1 row to be affected, actually affected: %d", affected))
	}

	return nil
}

func (um userModel) ChangeActiveStatus(id int, active bool) error {
	query := `
		update users set active = $1
		where id = $2
	`

	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	result, err := um.DB.ExecContext(ctx, query, active, id)
	if err != nil {
		return err
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if affected != 1 {
		return errors.New(fmt.Sprintf("expected 1 row to be affected, actually affected: %d", affected))
	}

	return nil
}

func (um userModel) ChangePassword(id int, password string) error {
	hashed, err := hash(password, 11)
	if err != nil {
		return err
	}

	query := `
		update users set password = $1
		where id = $2
	`

	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	result, err := um.DB.ExecContext(ctx, query, hashed, id)
	if err != nil {
		return err
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if affected != 1 {
		return errors.New(fmt.Sprintf("expected 1 row to be affected, actually affected: %d", affected))
	}

	return nil
}
