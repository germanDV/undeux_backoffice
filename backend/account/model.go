package account

import (
	"context"
	"database/sql"
	"time"
)

type Account struct {
	ID          int    `json:"id"`
	Currency    string `json:"currency"`
	Balance     int64  `json:"balance"`
	Description string `json:"description"`
}

type accountModel struct {
	DB *sql.DB
}

func (am accountModel) Get() ([]*Account, error) {
	query := `select id, currency, balance, coalesce(description, '') as description from accounts`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	rows, err := am.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sa []*Account

	for rows.Next() {
		a := &Account{}
		err := rows.Scan(&a.ID, &a.Currency, &a.Balance, &a.Description)
		if err != nil {
			return nil, err
		}
		sa = append(sa, a)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sa, nil
}
