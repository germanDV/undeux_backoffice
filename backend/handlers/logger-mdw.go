package handlers

import (
	"fmt"
	"net/http"
	"github.com/tomasen/realip"
	"time"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := realip.FromRequest(r)
		method := r.Method
		url := r.URL.RequestURI()
		t := time.Now().UTC().Format(time.RFC822Z)
		fmt.Printf("%s %s (ip=%s, time=%q)\n", method, url, ip, t)
		next.ServeHTTP(w, r)
	})
}
