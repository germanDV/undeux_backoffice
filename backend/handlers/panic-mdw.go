package handlers

import (
	"fmt"
	"net/http"
)

func (h *Handler) RecoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Create a defer function since it will always be run in the event of a panic
		defer func() {
			if err := recover(); err != nil {
				msg := fmt.Errorf("recovering from a panic: %s", err)
				h.L.Println(msg)
				WriteJSON(w, Envelope{"error": msg}, http.StatusInternalServerError)
			}
		}()

		next.ServeHTTP(w, r)
	})
}
