package project

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/go-playground/validator/v10"
)

type Project struct {
	ID       int    `json:"id"`
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Notes    string `json:"notes" validate:"max=500"`
	Finished bool   `json:"finished"`
}

type ProjectUpdate struct {
	ID       int  `json:"id" validate:"required,min=1"`
	Finished bool `json:"finished"`
}

type projectModel struct {
	DB *sql.DB
}

func (p *Project) Validate() error {
	validate := validator.New()
	return validate.Struct(p)
}

func (pu *ProjectUpdate) Validate() error {
	validate := validator.New()
	return validate.Struct(pu)
}

func (pm projectModel) Save(p *Project) error {
	query := `insert into projects (name, notes) values ($1, $2) returning id`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	err := pm.DB.QueryRowContext(ctx, query, p.Name, p.Notes).Scan(&p.ID)
	if err != nil {
		return err
	}

	return nil
}

func (pm projectModel) Get() ([]*Project, error) {
	query := `select id, name, notes, finished from projects`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	rows, err := pm.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sp []*Project

	for rows.Next() {
		p := &Project{}
		err := rows.Scan(&p.ID, &p.Name, &p.Notes, &p.Finished)
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

func (pm projectModel) Update(pu *ProjectUpdate) error {
	query := `update projects set finished = $1 where id = $2`
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()

	result, err := pm.DB.ExecContext(ctx, query, pu.Finished, pu.ID)
	if err != nil {
		return err
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errs.ErrRecordNotFound
	}
	if affected > 1 {
		return fmt.Errorf("Expected 1 row to be affected by upate, actually affected: %d", affected)
	}

	return nil
}
