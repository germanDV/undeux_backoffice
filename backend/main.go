package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/constructoraundeux/backoffice/auth"
	"github.com/constructoraundeux/backoffice/config"
	"github.com/constructoraundeux/backoffice/data"
	"github.com/julienschmidt/httprouter"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"strings"
	"time"
)

func main() {
	port := config.Config.Port
	env := config.Config.Env

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      routes(),
		IdleTimeout:  60 * time.Second,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	fmt.Println(fmt.Sprintf("starting server on %d - environment: %s.", port, env))
	err := srv.ListenAndServe()
	if err != nil {
		log.Panicln(err)
	}
}

func routes() http.Handler {
	r := httprouter.New()

	// API Routes: Other
	r.HandlerFunc(http.MethodGet, "/api/health", healthHandler)

	// API Routes: Auth
	r.HandlerFunc(http.MethodPost, "/api/login", loginHandler)
	r.HandlerFunc(http.MethodGet, "/api/me", meHandler)

	// Static assets
	r.NotFound = http.FileServer(http.Dir(filepath.Join(".", "web")))

	return r
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, envelope{"status": "OK"}, http.StatusOK)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := readJSON(w, r, &input)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	if input.Email != "german@undeux.com" || input.Password != "Abc123456789" {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	user := data.User{
		ID: 1,
		Role: "admin",
		Name: "German",
		Email: input.Email,
	}

	token, err := auth.CreateToken(user.ID, user.Role)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	writeJSON(w, envelope{"token": token, "user": user}, http.StatusOK)
}

func meHandler(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	if token == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	user, err := auth.VerifyToken(token)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	writeJSON(w, envelope{"user": user}, http.StatusOK)
}

type envelope map[string]interface{}

// writeJSON sends the response in JSON format,
// if an encoding error occurs, it sends an empty 500 response.
func writeJSON(w http.ResponseWriter, data envelope, status int) {
	jsn, err := json.Marshal(data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = w.Write(jsn)
}

// readJSON decodes r.Body into a destination and handles possible errors
func readJSON(w http.ResponseWriter, r *http.Request, dst interface{}) error {
	// Limit the size of the request body to 1MB to prevent malicious requests
	maxBytes := 1_048_576
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	// Initialize the decoder and disallow unknown fields, if an unknown field is found in the body,
	// we return an error. Without the DisallowUnknownFields, unknown fields would simply be ignored.
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	// Decode request body to the provided destination
	err := dec.Decode(dst)

	// Handle errors
	if err != nil {
		var syntaxError *json.SyntaxError
		var unmarshalTypeError *json.UnmarshalTypeError

		switch {
		case errors.As(err, &syntaxError):
			return fmt.Errorf("body contains badly-formed JSON (at character %d)", syntaxError.Offset)
		case errors.Is(err, io.ErrUnexpectedEOF):
			return errors.New("body contains badly-formed JSON")
		case errors.As(err, &unmarshalTypeError):
			if unmarshalTypeError.Field != "" {
				return fmt.Errorf("body contains incorrect JSON type for field %q", unmarshalTypeError.Field)
			}
			return fmt.Errorf("body contains incorrect JSON type (at character %d)", unmarshalTypeError.Offset)
		case errors.Is(err, io.EOF):
			return errors.New("body must not be empty")
		case strings.HasPrefix(err.Error(), "json: unknown field "):
			fieldName := strings.TrimPrefix(err.Error(), "json: unknown field ")
			return fmt.Errorf("body contains unknown key %s", fieldName)
		case err.Error() == "http: request body too large":
			return fmt.Errorf("body must not be larger than %d bytes", maxBytes)
		default:
			return err
		}
	}

	return nil
}
