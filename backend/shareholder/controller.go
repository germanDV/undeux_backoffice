package shareholder

import (
	"github.com/constructoraundeux/backoffice/handlers"
	"log"
	"net/http"
)

type shareholderController struct {
	Model iModel
	L     *log.Logger
}

func (sc shareholderController) Create(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name string `json:"name"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	s := &Shareholder{
		Name: input.Name,
	}

	err = s.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = sc.Model.Save(s)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"id": s.ID}, http.StatusCreated)
}
