package cash

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/constructoraundeux/backoffice/errs"
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

type Investment struct {
	ID            int    `json:"id"`
	Date          string `json:"date" validate:"date"`
	Amount        int64  `json:"amount" validate:"required,gt=0"`
	AccountID     int    `json:"accountId" validate:"required,gt=0"`
	ShareholderID int    `json:"shareholderId" validate:"required,gt=0"`
}

type Dividend struct {
	ID            int    `json:"id"`
	Date          string `json:"date" validate:"date"`
	Amount        int64  `json:"amount" validate:"required,gt=0"`
	AccountID     int    `json:"accountId" validate:"required,gt=0"`
	ShareholderID int    `json:"shareholderId" validate:"required,gt=0"`
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

func (i *Investment) Validate() error {
	validate := validator.New()
	validate.RegisterValidation("date", ValidateDate)
	return validate.Struct(i)
}

func (d *Dividend) Validate() error {
	validate := validator.New()
	validate.RegisterValidation("date", ValidateDate)
	return validate.Struct(d)
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

// GetPayments fetches all the payments.
func (cm cashModel) GetPayments() ([]*Payment, error) {
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

// GetPaymentByID fetches a single payment and returns it.
func (cm cashModel) GetPaymentByID(id int) (*Payment, error) {
	query := `
		select id, tx_date, amount, account_id, project_id, vendor_id, description
		from payments
		where id = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var p Payment
	err := cm.DB.QueryRowContext(ctx, query, id).Scan(
		&p.ID,
		&p.Date,
		&p.Amount,
		&p.AccountID,
		&p.ProjectID,
		&p.VendorID,
		&p.Description,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errs.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &p, nil
}

// DeletePayment removes payment from database and updates account balance.
func (cm cashModel) DeletePayment(p *Payment) error {
	paymentQuery := `delete from payments where id = $1`
	paymentArgs := []interface{}{p.ID}

	balanceQuery := `update accounts set balance = balance + $1 where id = $2`
	balanceArgs := []interface{}{p.Amount, p.AccountID}

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

// Collect inserts a new collection record and updates the account balance.
func (cm cashModel) Collect(c *Collection) error {
	collectionQuery := `
		insert into collections (amount, description, account_id, project_id, customer_id, tx_date)
		values ($1, $2, $3, $4, $5, $6)
		returning id
	`
	collectionArgs := []interface{}{
		c.Amount,
		c.Description,
		c.AccountID,
		c.ProjectID,
		c.CustomerID,
		c.Date,
	}

	balanceQuery := `update accounts set balance = balance + $1 where id = $2`
	balanceArgs := []interface{}{c.Amount, c.AccountID}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := cm.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, collectionQuery, collectionArgs...)
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

// GetCollections fetches all the collections.
func (cm cashModel) GetCollections() ([]*Collection, error) {
	query := `select id, tx_date, amount, account_id, project_id, customer_id, description from collections`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	rows, err := cm.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sc []*Collection

	for rows.Next() {
		c := &Collection{}
		err := rows.Scan(
			&c.ID,
			&c.Date,
			&c.Amount,
			&c.AccountID,
			&c.ProjectID,
			&c.CustomerID,
			&c.Description,
		)
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

// GetCollectionByID fetches a single payment and returns it.
func (cm cashModel) GetCollectionByID(id int) (*Collection, error) {
	query := `
		select id, tx_date, amount, account_id, project_id, customer_id, description
		from collections
		where id = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var c Collection
	err := cm.DB.QueryRowContext(ctx, query, id).Scan(
		&c.ID,
		&c.Date,
		&c.Amount,
		&c.AccountID,
		&c.ProjectID,
		&c.CustomerID,
		&c.Description,
	)

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

// DeleteCollection removes a collection from database and updates account balance.
func (cm cashModel) DeleteCollection(c *Collection) error {
	collectionQuery := `delete from collections where id = $1`
	collectionArgs := []interface{}{c.ID}

	balanceQuery := `update accounts set balance = balance - $1 where id = $2`
	balanceArgs := []interface{}{c.Amount, c.AccountID}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := cm.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, collectionQuery, collectionArgs...)
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

// Invest records an investment from a shareholder and updates the account balance.
func (cm cashModel) Invest(i *Investment) error {
	investmentQuery := `
		insert into investments (amount, account_id, shareholder_id, tx_date)
		values ($1, $2, $3, $4)
		returning id
	`
	investmentArgs := []interface{}{
		i.Amount,
		i.AccountID,
		i.ShareholderID,
		i.Date,
	}

	balanceQuery := `update accounts set balance = balance + $1 where id = $2`
	balanceArgs := []interface{}{i.Amount, i.AccountID}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := cm.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, investmentQuery, investmentArgs...)
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

// GetInvestments fetches all the investments from shareholders.
func (cm cashModel) GetInvestments() ([]*Investment, error) {
	query := `select id, tx_date, amount, account_id, shareholder_id from investments`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	rows, err := cm.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var si []*Investment

	for rows.Next() {
		i := &Investment{}
		err := rows.Scan(
			&i.ID,
			&i.Date,
			&i.Amount,
			&i.AccountID,
			&i.ShareholderID,
		)
		if err != nil {
			return nil, err
		}
		si = append(si, i)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return si, nil
}

// GetInvestmentByID fetches a single investment and returns it.
func (cm cashModel) GetInvestmentByID(id int) (*Investment, error) {
	query := `
		select id, tx_date, amount, account_id, shareholder_id
		from investments
		where id = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var i Investment
	err := cm.DB.QueryRowContext(ctx, query, id).Scan(
		&i.ID,
		&i.Date,
		&i.Amount,
		&i.AccountID,
		&i.ShareholderID,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errs.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &i, nil
}

// DeleteInvestment removes an investment from database and updates account balance.
func (cm cashModel) DeleteInvestment(i *Investment) error {
	investmentQuery := `delete from investments where id = $1`
	investmentArgs := []interface{}{i.ID}

	balanceQuery := `update accounts set balance = balance - $1 where id = $2`
	balanceArgs := []interface{}{i.Amount, i.AccountID}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := cm.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, investmentQuery, investmentArgs...)
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

// PayDividend records a dividend to a shareholder and updates the account balance.
func (cm cashModel) PayDividend(d *Dividend) error {
	dividendQuery := `
		insert into dividends (amount, account_id, shareholder_id, tx_date)
		values ($1, $2, $3, $4)
		returning id
	`
	dividendArgs := []interface{}{
		d.Amount,
		d.AccountID,
		d.ShareholderID,
		d.Date,
	}

	balanceQuery := `update accounts set balance = balance - $1 where id = $2`
	balanceArgs := []interface{}{d.Amount, d.AccountID}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := cm.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, dividendQuery, dividendArgs...)
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

// GetDividends fetches all the dividends to shareholders.
func (cm cashModel) GetDividends() ([]*Dividend, error) {
	query := `select id, tx_date, amount, account_id, shareholder_id from dividends`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	rows, err := cm.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sd []*Dividend

	for rows.Next() {
		d := &Dividend{}
		err := rows.Scan(
			&d.ID,
			&d.Date,
			&d.Amount,
			&d.AccountID,
			&d.ShareholderID,
		)
		if err != nil {
			return nil, err
		}
		sd = append(sd, d)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sd, nil
}

// GetDividendByID fetches a single dividend and returns it.
func (cm cashModel) GetDividendByID(id int) (*Dividend, error) {
	query := `
		select id, tx_date, amount, account_id, shareholder_id
		from dividends
		where id = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var d Dividend
	err := cm.DB.QueryRowContext(ctx, query, id).Scan(
		&d.ID,
		&d.Date,
		&d.Amount,
		&d.AccountID,
		&d.ShareholderID,
	)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errs.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &d, nil
}

// DeleteDividend removes a dividend from database and updates account balance.
func (cm cashModel) DeleteDividend(d *Dividend) error {
	dividendQuery := `delete from dividends where id = $1`
	dividendArgs := []interface{}{d.ID}

	balanceQuery := `update accounts set balance = balance + $1 where id = $2`
	balanceArgs := []interface{}{d.Amount, d.AccountID}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := cm.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, dividendQuery, dividendArgs...)
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
