package cash

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/go-playground/validator/v10"
)

type Payment struct {
	ID          int    `json:"id"`
	Date        string `json:"date" validate:"date"`
	Amount      int64  `json:"amount" validate:"required,gt=0"`
	Description string `json:"description" validate:"required,min=2,max=500"`
	AccountID   int    `json:"accountId" validate:"required,gt=0"`
	ProjectID   int    `json:"projectId" validate:"required,gt=0"`
	VendorID    int    `json:"vendorId" validate:"required,gt=0"`
}

type Collection struct {
	ID          int    `json:"id"`
	Date        string `json:"date" validate:"date"`
	Amount      int64  `json:"amount" validate:"required,gt=0"`
	Description string `json:"description" validate:"required,min=2,max=500"`
	AccountID   int    `json:"accountId" validate:"required,gt=0"`
	ProjectID   int    `json:"projectId" validate:"required,gt=0"`
	CustomerID  int    `json:"customerId" validate:"required,gt=0"`
}

type cashModel struct {
	DB *sql.DB
}

func (p *Payment) Validate() error {
	validate := validator.New()
	validate.RegisterValidation("date", ValidateDate)
	return validate.Struct(p)
}

func (c *Collection) Validate() error {
	validate := validator.New()
	validate.RegisterValidation("date", ValidateDate)
	return validate.Struct(c)
}

func ValidateDate(fl validator.FieldLevel) bool {
	input := fl.Field().String()
	_, err := time.Parse("2006-01-02", input)
	return err == nil
}

// Pay inserts a new payment record and updates the account balance.
func (cm cashModel) Pay(pmnt *Payment) error {
	paymentQuery := `
		insert into payments (amount, description, account_id, project_id, vendor_id, tx_date)
		values ($1, $2, $3, $4, $5, $6)
		returning id
	`
	paymentArgs := []interface{}{
		pmnt.Amount,
		pmnt.Description,
		pmnt.AccountID,
		pmnt.ProjectID,
		pmnt.VendorID,
		pmnt.Date,
	}

	balanceQuery := `update accounts set balance = balance - $1 where id = $2`
	balanceArgs := []interface{}{pmnt.Amount, pmnt.AccountID}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := cm.DB.BeginTx(ctx, nil)
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

// Get fetches all the payments.
func (cm cashModel) Get() ([]*Payment, error) {
	query := `select id, tx_date, amount, account_id, project_id, vendor_id, description from payments`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	rows, err := cm.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sp []*Payment

	for rows.Next() {
		p := &Payment{}
		err := rows.Scan(
			&p.ID,
			&p.Date,
			&p.Amount,
			&p.AccountID,
			&p.ProjectID,
			&p.VendorID,
			&p.Description,
		)
		if err != nil {
			return nil, err
		}
		sp = append(sp, p)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sp, nil
}