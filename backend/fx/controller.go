package fx

import (
	"github.com/constructoraundeux/backoffice/handlers"
	"log"
	"net/http"
	"time"
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

	// If fx is too old, fetch a new one for subsequent requests.
	lastUpdate, err := time.Parse(time.RFC3339, fx.UpdatedAt)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	now := time.Now().UTC()
	diff := now.Sub(lastUpdate)
	if diff >= 12*time.Hour {
		fxc.L.Println("Exchange rate is too old, fetching one for next time...")
		// TODO: do the update in a goroutine and reply with the "old" one.
	}

	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"fx": fx}, http.StatusOK)
}
