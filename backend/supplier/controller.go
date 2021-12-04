package vendor

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/constructoraundeux/backoffice/handlers"
	"github.com/julienschmidt/httprouter"
)

type vendorController struct {
	Model iModel
	L     *log.Logger
}

func (vc vendorController) Create(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name  string `json:"name"`
		Notes string `json:"notes"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	v := &Vendor{
		Name:  input.Name,
		Notes: input.Notes,
	}

	err = v.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = vc.Model.Save(v)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"id": v.ID}, http.StatusCreated)
}

func (vc vendorController) List(w http.ResponseWriter, r *http.Request) {
	sv, err := vc.Model.Get()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"vendors": sv}, http.StatusOK)
}

func (vc vendorController) Find(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	idStr := params.ByName("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": "invalid ID provided."}, http.StatusBadRequest)
		return
	}

	v, err := vc.Model.GetByID(id)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "vendor not found"}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"vendor": v}, http.StatusOK)
}

func (vc vendorController) Pay(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Amount      int64  `json:"amount"`
		Description string `json:"description"`
		AccountID   int    `json:"accountId"`
		ProjectID   int    `json:"projectId"`
		VendorID    int    `json:"vendorId"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	pmnt := &Payment{
		Amount:      input.Amount,
		Description: input.Description,
		AccountID:   input.AccountID,
		ProjectID:   input.ProjectID,
		VendorID:    input.VendorID,
	}

	err = pmnt.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = vc.Model.Pay(pmnt)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	msg := fmt.Sprintf("Successful payment of %d to vendor with ID %d", pmnt.Amount, pmnt.VendorID)
	handlers.WriteJSON(w, handlers.Envelope{"msg": msg}, http.StatusOK)
}
