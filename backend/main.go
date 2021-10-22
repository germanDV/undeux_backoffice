package main

import (
	"fmt"
	"github.com/constructoraundeux/backoffice/config"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	port := config.Config.Port
	env := config.Config.Env
	dsn := config.Config.DatabaseDSN

	// Create custom logger
	l := log.New(os.Stdout, "[undeux] ", log.LstdFlags|log.LUTC)

	// Initialize connection pool and test the connection
	db, err := openDB(dsn)
	if err != nil {
		l.Panicln(err)
	}
	defer db.Close()
	l.Println("database connection pool established")

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      routes(db, l),
		IdleTimeout:  60 * time.Second,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	l.Println(fmt.Sprintf("starting server on %d - environment: %s", port, env))
	err = srv.ListenAndServe()
	if err != nil {
		l.Panicln(err)
	}
}
