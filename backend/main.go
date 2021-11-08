package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/constructoraundeux/backoffice/config"
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

	// Start server on a subroutine
	go func() {
		l.Println(fmt.Sprintf("starting server on %d - environment: %s", port, env))
		err = srv.ListenAndServe()
		if err != nil {
			if errors.Is(err, http.ErrServerClosed) {
				l.Println("Server stopped.")
			} else {
				l.Panicln(err)
			}
		}
	}()

	// Handle graceful shutdown
	quitCh := make(chan os.Signal, 1)
	signal.Notify(quitCh, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quitCh
	var waitTime time.Duration = 5
	l.Printf("Received termination signal %q, graceful shutdown in %ds.\n", sig, waitTime)
	tc, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	// should use a waitgroup to keep track of subroutines instead of a timeout
	time.Sleep(waitTime * time.Second)
	_ = srv.Shutdown(tc)
}
