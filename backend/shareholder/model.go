package shareholder

import (
	"context"
	"database/sql"
	"github.com/go-playground/validator/v10"
	"time"
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
