package cash

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/constructoraundeux/backoffice/handlers"
	"github.com/julienschmidt/httprouter"
)

type cashController struct {
	Model iModel
	L     *log.Logger
}

func (cc cashController) Pay(w http.ResponseWriter, r *http.Request) {
	cc.L.Println("Processing payment request")
	var input struct {
		Date        string `json:"date,omitempty"`
		Amount      int64  `json:"amount"`
		Description string `json:"description"`
		AccountID   int    `json:"accountId"`
		ProjectID   int    `json:"projectId"`
		VendorID    int    `json:"vendorId"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		cc.L.Println("Error decoding JSON.")
		return
	}

	if input.Date == "" {
		input.Date = time.Now().UTC().String()
	}

	pmnt := &Payment{
		Amount:      input.Amount,
		Date:        input.Date,
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

	err = cc.Model.Pay(pmnt)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	msg := fmt.Sprintf("Successful payment of %d to vendor with ID %d", pmnt.Amount, pmnt.VendorID)
	handlers.WriteJSON(w, handlers.Envelope{"msg": msg}, http.StatusOK)
}

func (cc cashController) ListPayments(w http.ResponseWriter, r *http.Request) {
	sp, err := cc.Model.GetPayments()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"payments": sp}, http.StatusOK)
}

func (cc cashController) FindPayment(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	idStr := params.ByName("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": "invalid ID provided."}, http.StatusBadRequest)
		return
	}

	p, err := cc.Model.GetPaymentByID(id)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "payment not found"}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"payment": p}, http.StatusOK)
}

func (cc cashController) DeletePayment(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	idStr := params.ByName("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": "invalid ID provided."}, http.StatusBadRequest)
		return
	}

	pmnt, err := cc.Model.GetPaymentByID(id)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "payment not found"}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	err = cc.Model.DeletePayment(pmnt)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"msg": "Payment deleted successfully"}, http.StatusOK)
}

func (cc cashController) Collect(w http.ResponseWriter, r *http.Request) {
	cc.L.Println("Processing collection request")
	var input struct {
		Date        string `json:"date,omitempty"`
		Amount      int64  `json:"amount"`
		Description string `json:"description"`
		AccountID   int    `json:"accountId"`
		ProjectID   int    `json:"projectId"`
		CustomerID  int    `json:"customerId"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		cc.L.Println("Error decoding JSON.")
		return
	}

	if input.Date == "" {
		input.Date = time.Now().UTC().String()
	}

	coll := &Collection{
		Amount:      input.Amount,
		Date:        input.Date,
		Description: input.Description,
		AccountID:   input.AccountID,
		ProjectID:   input.ProjectID,
		CustomerID:  input.CustomerID,
	}

	err = coll.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = cc.Model.Collect(coll)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	msg := fmt.Sprintf("Successful collection of %d from customer with ID %d", coll.Amount, coll.CustomerID)
	handlers.WriteJSON(w, handlers.Envelope{"msg": msg}, http.StatusOK)
}

func (cc cashController) ListCollections(w http.ResponseWriter, r *http.Request) {
	sc, err := cc.Model.GetCollections()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"collections": sc}, http.StatusOK)
}

func (cc cashController) FindCollection(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	idStr := params.ByName("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": "invalid ID provided."}, http.StatusBadRequest)
		return
	}

	c, err := cc.Model.GetCollectionByID(id)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "collection not found"}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"collection": c}, http.StatusOK)
}

func (cc cashController) DeleteCollection(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	idStr := params.ByName("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": "invalid ID provided."}, http.StatusBadRequest)
		return
	}

	coll, err := cc.Model.GetCollectionByID(id)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "collection not found"}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	err = cc.Model.DeleteCollection(coll)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"msg": "Collection deleted successfully"}, http.StatusOK)
}
