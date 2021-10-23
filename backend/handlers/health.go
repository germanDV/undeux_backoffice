package handlers

import (
	"net/http"
)

func Health(w http.ResponseWriter, r *http.Request) {
	WriteJSON(w, Envelope{"status": "OK"}, http.StatusOK)
}
