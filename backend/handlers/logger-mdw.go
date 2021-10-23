package handlers

import (
	"github.com/tomasen/realip"
	"net/http"
)

func (h *Handler) Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := realip.FromRequest(r)
		method := r.Method
		url := r.URL.RequestURI()
		h.L.Printf("%s %s (ip=%s)\n", method, url, ip)
		next.ServeHTTP(w, r)
	})
}
