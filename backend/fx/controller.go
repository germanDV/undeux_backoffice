package fx

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/constructoraundeux/backoffice/errs"
	"github.com/constructoraundeux/backoffice/handlers"
)

type fxController struct {
	Model iModel
	L     *log.Logger
}

func (fxc fxController) Set(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Currency string  `json:"currency"`
		Rate     float64 `json:"rate"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	fx := &FX{
		Currency:  input.Currency,
		Rate:      input.Rate,
		UpdatedAt: time.Now().UTC().Format(time.RFC3339),
	}

	err = fx.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = fxc.Model.Set(fx)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"msg": "Updated", "currency": fx.Currency}, http.StatusCreated)
}

func (fxc fxController) Get(w http.ResponseWriter, _ *http.Request) {
	fx, err := fxc.Model.Get()
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "load at least one rate in the DDBB."}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	lastUpdate, err := time.Parse(time.RFC3339, fx.UpdatedAt)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	now := time.Now().UTC()
	diff := now.Sub(lastUpdate)
	if diff >= 12*time.Hour {
		fxc.L.Println("Exchange rate is too old, updating for following requests...")
		go func() {
			r, err := fetchRate()
			if err != nil {
				fxc.L.Printf("Error fetching rate from BCRA %q\n", err.Error())
				return
			}

			fxc.L.Printf("Successfully fetched rate from BCRA: %v\n", r)

			err = fxc.Model.Set(&FX{
				Currency:  "ARS",
				Rate:      r,
				UpdatedAt: time.Now().UTC().Format(time.RFC3339),
			})

			if err != nil {
				fxc.L.Printf("Error updating rate in database %q\n", err.Error())
			}
			fxc.L.Printf("Successfully saved rate %v in database\n", r)
		}()
	}

	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"fx": fx}, http.StatusOK)
}
