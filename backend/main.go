package main

import (
	"fmt"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"path/filepath"
	"time"
)

func main() {
	srv := &http.Server{
		Addr: ":8080",
		Handler: routes(),
		IdleTimeout:  60*time.Second,
		ReadTimeout:  10*time.Second,
		WriteTimeout: 30*time.Second,
	}


	fmt.Println(fmt.Sprintf("starting server on %s", srv.Addr))
	err := srv.ListenAndServe()
	if err != nil {
		log.Panicln(err)
	}
}

func routes() http.Handler {
	r := httprouter.New()

	// API routes
	r.HandlerFunc(http.MethodGet, "/api/health", healthHandler)
	r.HandlerFunc(http.MethodGet, "/api/ping", pingHandler)

	// Static assets
	r.NotFound = http.FileServer(http.Dir(filepath.Join(".", "web")))

	return r
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(200)
	w.Write([]byte("OK"))
}

func pingHandler(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(200)
	w.Write([]byte("pong"))
}
