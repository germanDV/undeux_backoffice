package customer

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/go-playground/validator/v10"
)

type Customer struct {
	ID     int    `json:"id"`
	Name   string `json:"name" validate:"required,min=2,max=32"`
	Notes  string `json:"notes" validate:"max=500"`
	Active bool   `json:"active"`
}

type customerModel struct {
	DB *sql.DB
}

func (c *Customer) Validate() error {
	validate := validator.New()
	return validate.Struct(c)
}

func (cm customerModel) Save(c *Customer) error {
	query := `insert into customers (name, notes) values ($1, $2) returning id`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	err := cm.DB.QueryRowContext(ctx, query, c.Name, c.Notes).Scan(&c.ID)
	if err != nil {
		return err
	}

	return nil
}

func (cm customerModel) Get() ([]*Customer, error) {
	query := `select id, name, notes, active from customers`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	rows, err := cm.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sc []*Customer

	for rows.Next() {
		c := &Customer{}
		err := rows.Scan(&c.ID, &c.Name, &c.Notes, &c.Active)
		if err != nil {
			return nil, err
		}
		sc = append(sc, c)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sc, nil
}

func (cm customerModel) GetByID(id int) (*Customer, error) {
	query := `select id, name, notes, active from customers where id = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var c Customer
	err := cm.DB.QueryRowContext(ctx, query, id).Scan(&c.ID, &c.Name, &c.Notes, &c.Active)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errs.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &c, nil
}
