package project

import (
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/constructoraundeux/backoffice/handlers"
)

type projectController struct {
	Model iModel
	L     *log.Logger
}

func (pc projectController) Create(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name  string `json:"name"`
		Notes string `json:"notes"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	p := &Project{
		Name:  input.Name,
		Notes: input.Notes,
	}

	err = p.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = pc.Model.Save(p)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"id": p.ID}, http.StatusCreated)
}

func (pc projectController) List(w http.ResponseWriter, r *http.Request) {
	sp, err := pc.Model.Get()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"projects": sp}, http.StatusOK)
}

func (pc projectController) Update(w http.ResponseWriter, r *http.Request) {
	var input struct {
		ID       int  `json:"id"`
		Finished bool `json:"finished"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	pu := &ProjectUpdate{
		ID:       input.ID,
		Finished: input.Finished,
	}

	err = pu.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = pc.Model.Update(pu)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "project not found"}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	msg := fmt.Sprintf("Project %d updated successfully", pu.ID)
	handlers.WriteJSON(w, handlers.Envelope{"msg": msg}, http.StatusOK)
}
