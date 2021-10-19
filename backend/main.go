package main

import (
	"fmt"
	"github.com/constructoraundeux/backoffice/config"
	"log"
	"net/http"
	"time"
)

func main() {
	port := config.Config.Port
	env := config.Config.Env
	dsn := config.Config.DatabaseDSN

	// Initialize connection pool and test the connection
	db, err := openDB(dsn)
	if err != nil {
		log.Panicln(err)
	}
	defer db.Close()
	fmt.Println("database connection pool established")

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      routes(db),
		IdleTimeout:  60 * time.Second,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	fmt.Println(fmt.Sprintf("starting server on %d - environment: %s.", port, env))
	err = srv.ListenAndServe()
	if err != nil {
		log.Panicln(err)
	}
}
