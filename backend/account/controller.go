package account

import (
	"log"
	"net/http"

	"github.com/constructoraundeux/backoffice/handlers"
)

type accountController struct {
	Model iModel
	L     *log.Logger
}

func (ac accountController) List(w http.ResponseWriter, r *http.Request) {
	sa, err := ac.Model.Get()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"accounts": sa}, http.StatusOK)
}
