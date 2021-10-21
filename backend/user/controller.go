package user

import (
	"errors"
	"fmt"
	"github.com/constructoraundeux/backoffice/errs"
	"github.com/constructoraundeux/backoffice/handlers"
	"net/http"
	"strings"
)

type userController struct {
	Model iModel
}

func (uc userController) Register(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email string `json:"email"`
		Name string `json:"name"`
		Password string `json:"password"`
		Role string `json:"role"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	u := &User{
		Name: input.Name,
		Email: strings.ToLower(input.Email),
		PasswordPlain: input.Password,
		Role: strings.ToLower(input.Role),
		Active: true,
	}

	err = u.Validate()
	if err != nil {
		msg := err.Error()
		handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusBadRequest)
		return
	}

	err = uc.Model.Save(u)
	if err != nil {
		msg := err.Error()
		handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"id": u.ID}, http.StatusCreated)
}

func (uc userController) Login(w http.ResponseWriter, r *http.Request) {
	var input UserLoginSubmission

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}

	err = input.Validate()
	if err != nil {
		msg := err.Error()
		handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusBadRequest)
		return
	}

	user, err := uc.Model.GetByEmail(input.Email)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "invalid credentials"}, http.StatusUnauthorized)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}

	if !matches(input.PasswordPlain, user.PasswordHash) {
		handlers.WriteJSON(w, handlers.Envelope{"error": "invalid credentials"}, http.StatusUnauthorized)
		return
	}

	if !user.Active {
		handlers.WriteJSON(w, handlers.Envelope{"error": "inactive user account"}, http.StatusUnauthorized)
		return
	}

	token, err := createToken(user.ID, user.Role)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"token": token, "user": user}, http.StatusOK)
}

func (uc userController) Me(w http.ResponseWriter, r *http.Request) {
	token := r.Header.Get("Authorization")
	if token == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// TODO: token verification and user retrieval must be done in a middleware
	user, err := verifyToken(token)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"user": user}, http.StatusOK)
}
