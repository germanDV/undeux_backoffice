package fx

import (
	"context"
	"database/sql"
	"github.com/go-playground/validator/v10"
	"time"
)

type FX struct {
	Currency  string  `json:"currency" validate:"required,min=3,max=6"`
	Rate      float64 `json:"rate" validate:"required,gt=0"`
	UpdatedAt string  `json:"updatedAt"`
}

type fxModel struct {
	DB *sql.DB
}

func (fx *FX) Validate() error {
	validate := validator.New()
	return validate.Struct(fx)
}

// Set inserts the exchange rate in the database.
func (fxm fxModel) Set(fx *FX) error {
	query := `
		insert into fx (currency, rate, updated_at)
		values ($1, $2, $3)
		on conflict (currency)
		do update set rate = excluded.rate, updated_at = excluded.updated_at;
	`

	args := []interface{}{fx.Currency, fx.Rate, fx.UpdatedAt}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_, err := fxm.DB.ExecContext(ctx, query, args...)
	return err
}

// Get retrieves the exchange rate from the database.
func (fxm fxModel) Get() (*FX, error) {
	query := `select currency, rate, updated_at from fx where currency = $1`
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var fx FX
	err := fxm.DB.QueryRowContext(ctx, query, "ARS").Scan(&fx.Currency, &fx.Rate, &fx.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &fx, nil
}
