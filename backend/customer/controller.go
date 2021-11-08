package customer

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/constructoraundeux/backoffice/handlers"
	"github.com/julienschmidt/httprouter"
)

type customerController struct {
	Model iModel
	L     *log.Logger
}

func (cc customerController) Create(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name  string `json:"name"`
		Notes string `json:"notes"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	c := &Customer{
		Name:  input.Name,
		Notes: input.Notes,
	}

	err = c.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = cc.Model.Save(c)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"id": c.ID}, http.StatusCreated)
}

func (cc customerController) List(w http.ResponseWriter, r *http.Request) {
	sc, err := cc.Model.Get()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"customers": sc}, http.StatusOK)
}

func (cc customerController) Find(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	idStr := params.ByName("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": "invalid ID provided."}, http.StatusBadRequest)
		return
	}

	c, err := cc.Model.GetByID(id)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "customer not found"}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"customer": c}, http.StatusOK)
}
