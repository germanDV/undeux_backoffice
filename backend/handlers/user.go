package handlers

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/constructoraundeux/backoffice/auth"
	"github.com/constructoraundeux/backoffice/data"
	"net/http"
	"strings"
)

type Controller struct {
	DB *sql.DB
}

func (c Controller) Register(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email string `json:"email"`
		Name string `json:"name"`
		Password string `json:"password"`
		Role string `json:"role"`
	}

	err := readJSON(w, r, &input)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	u := &data.User{
		Name: input.Name,
		Email: strings.ToLower(input.Email),
		PasswordPlain: input.Password,
		Role: strings.ToLower(input.Role),
		Active: true,
	}

	err = u.Validate()
	if err != nil {
		msg := err.Error()
		writeJSON(w, envelope{"error": msg}, http.StatusBadRequest)
		return
	}

	err = u.Save(c.DB)
	if err != nil {
		msg := err.Error()
		writeJSON(w, envelope{"error": msg}, http.StatusInternalServerError)
		return
	}

	writeJSON(w, envelope{"id": u.ID}, http.StatusCreated)
}

func (c Controller) Login(w http.ResponseWriter, r *http.Request) {
	var input data.UserLoginSubmission

	err := readJSON(w, r, &input)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	err = input.Validate()
	if err != nil {
		msg := err.Error()
		writeJSON(w, envelope{"error": msg}, http.StatusBadRequest)
		return
	}

	user, err := data.GetUserByEmail(c.DB, input.Email)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			writeJSON(w, envelope{"error": "invalid credentials"}, http.StatusUnauthorized)
		default:
			writeJSON(w, envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	if !data.Matches(input.PasswordPlain, user.PasswordHash) {
		writeJSON(w, envelope{"error": "invalid credentials"}, http.StatusUnauthorized)
		return
	}

	if !user.Active {
		writeJSON(w, envelope{"error": "inactive user account"}, http.StatusUnauthorized)
		return
	}

	token, err := auth.CreateToken(user.ID, user.Role)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	writeJSON(w, envelope{"token": token, "user": user}, http.StatusOK)
}

func (c Controller) Me(w http.ResponseWriter, r *http.Request) {
	// TODO: update this endpoint to fetch the user by token and do what's required.
	token := r.Header.Get("Authorization")
	if token == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// TODO: VerifyToken should only return user ID, which should be used to fetch user from the DB.
	user, err := auth.VerifyToken(token)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	writeJSON(w, envelope{"user": user}, http.StatusOK)
}
