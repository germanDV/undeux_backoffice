package handlers

import "net/http"

func Health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, envelope{"status": "OK"}, http.StatusOK)
}
