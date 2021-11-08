package shareholder

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/go-playground/validator/v10"
)

type Shareholder struct {
	ID   int    `json:"id"`
	Name string `json:"name" validate:"required,min=2,max=32"`
}

type shareholderModel struct {
	DB *sql.DB
}

func (s *Shareholder) Validate() error {
	validate := validator.New()
	return validate.Struct(s)
}

func (sm shareholderModel) Save(s *Shareholder) error {
	query := `insert into shareholders (name) values ($1) returning id`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	err := sm.DB.QueryRowContext(ctx, query, s.Name).Scan(&s.ID)
	if err != nil {
		return err
	}

	return nil
}

func (sm shareholderModel) Get() ([]*Shareholder, error) {
	query := `select id, name from shareholders`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	rows, err := sm.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ss []*Shareholder

	for rows.Next() {
		s := &Shareholder{}
		err := rows.Scan(&s.ID, &s.Name)
		if err != nil {
			return nil, err
		}
		ss = append(ss, s)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return ss, nil
}

func (sm shareholderModel) GetByID(id int) (*Shareholder, error) {
	query := `select id, name from shareholders where id = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	var s Shareholder
	err := sm.DB.QueryRowContext(ctx, query, id).Scan(&s.ID, &s.Name)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, errs.ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &s, nil
}
