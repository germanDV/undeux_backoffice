package vendor

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/go-playground/validator/v10"
)

type Vendor struct {
	ID     int    `json:"id"`
	Name   string `json:"name" validate:"required,min=2,max=32"`
	Notes  string `json:"notes" validate:"max=500"`
	Active bool   `json:"active"`
}

type vendorModel struct {
	DB *sql.DB
}

type Payment struct {
	Amount      int64  `json:"amount" validate:"required,gt=0"`
	Description string `json:"description" validate:"required,min=2,max=500"`
	AccountID   int    `json:"accountId" validate:"required,gt=0"`
	ProjectID   int    `json:"projectId" validate:"required,gt=0"`
	VendorID    int    `json:"vendorId" validate:"required,gt=0"`
}

func (v *Vendor) Validate() error {
	validate := validator.New()
	return validate.Struct(v)
}

func (p *Payment) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
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
	query := `select id, name, notes, active from vendors`
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
		err := rows.Scan(&v.ID, &v.Name, &v.Notes, &v.Active)
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
	query := `select id, name, notes, active from vendors where id = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var v Vendor
	err := vm.DB.QueryRowContext(ctx, query, id).Scan(&v.ID, &v.Name, &v.Notes, &v.Active)
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

// Pay inserts a new payment record and updates the account balance.
func (vm vendorModel) Pay(pmnt *Payment) error {
	paymentQuery := `
		insert into payments (amount, description, account_id, project_id, vendor_id)
		values ($1, $2, $3, $4, $5)
		returning id
	`
	paymentArgs := []interface{}{
		pmnt.Amount,
		pmnt.Description,
		pmnt.AccountID,
		pmnt.ProjectID,
		pmnt.VendorID,
	}

	balanceQuery := `update accounts set balance = balance - $1 where id = $2`
	balanceArgs := []interface{}{pmnt.Amount, pmnt.AccountID}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := vm.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, paymentQuery, paymentArgs...)
	if err != nil {
		rbErr := tx.Rollback()
		if rbErr != nil {
			return fmt.Errorf("tx err: %v, rollback err: %v.", err, rbErr)
		}
		return err
	}

	_, err = tx.ExecContext(ctx, balanceQuery, balanceArgs...)
	if err != nil {
		rbErr := tx.Rollback()
		if rbErr != nil {
			return fmt.Errorf("tx err: %v, rollback err: %v.", err, rbErr)
		}
		return err
	}

	return tx.Commit()
}
