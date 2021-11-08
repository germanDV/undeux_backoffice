package vendor

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/go-playground/validator/v10"
)

type Vendor struct {
	ID    int    `json:"id"`
	Name  string `json:"name" validate:"required,min=2,max=32"`
	Notes string `json:"notes"`
}

type vendorModel struct {
	DB *sql.DB
}

func (s *Vendor) Validate() error {
	validate := validator.New()
	return validate.Struct(s)
}

func (vm vendorModel) Save(v *Vendor) error {
	query := `insert into vendors (name, notes) values ($1, $2) returning id`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	err := vm.DB.QueryRowContext(ctx, query, v.Name, v.Notes).Scan(&v.ID)
	if err != nil {
		return err
	}

	return nil
}

func (vm vendorModel) Get() ([]*Vendor, error) {
	query := `select id, name, notes from vendors`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	rows, err := vm.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sv []*Vendor

	for rows.Next() {
		v := &Vendor{}
		err := rows.Scan(&v.ID, &v.Name, &v.Notes)
		if err != nil {
			return nil, err
		}
		sv = append(sv, v)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sv, nil
}

func (vm vendorModel) GetByID(id int) (*Vendor, error) {
	query := `select id, name, notes from vendors where id = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var v Vendor
	err := vm.DB.QueryRowContext(ctx, query, id).Scan(&v.ID, &v.Name, &v.Notes)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errs.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &v, nil
}
