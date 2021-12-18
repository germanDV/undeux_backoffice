package cash

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/constructoraundeux/backoffice/handlers"
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

func (cc cashController) List(w http.ResponseWriter, r *http.Request) {
	sp, err := cc.Model.Get()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"payments": sp}, http.StatusOK)
}
