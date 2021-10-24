package user

import (
	"errors"
	"github.com/constructoraundeux/backoffice/errs"
	"github.com/constructoraundeux/backoffice/handlers"
	"log"
	"net/http"
	"strings"
)

type userController struct {
	Model iModel
	L *log.Logger
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
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
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
		switch {
		case errors.Is(err, errs.ErrDuplicateEmail):
			handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusBadRequest)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusInternalServerError)
		}
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"id": u.ID}, http.StatusCreated)
}

func (uc userController) Login(w http.ResponseWriter, r *http.Request) {
	var input UserLoginSubmission

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
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
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"token": token, "user": user}, http.StatusOK)
}

func (uc userController) Me(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value("undeuxUser").(*User)
	if !ok {
		msg := "no user has been found in the request context"
		handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusUnauthorized)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"user": user}, http.StatusOK)
}

func (uc userController) All(w http.ResponseWriter, _ *http.Request) {
	users, err := uc.Model.GetAll()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}
	handlers.WriteJSON(w, handlers.Envelope{"users": users}, http.StatusOK)
}

func (uc userController) Upgrade(w http.ResponseWriter, r *http.Request) {
	var input struct {
		UserID int `json:"userId"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = uc.Model.MakeAdmin(input.UserID)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"message": "OK"}, http.StatusOK)
}

func (uc userController) ChangeStatus(w http.ResponseWriter, r *http.Request) {
	var input struct {
		UserID int `json:"userId"`
		Active bool `json:"active"`
	}

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	user, err := uc.Model.GetByID(input.UserID)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "user not found"}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}
	if user.Role != "user" {
		msg := "can only update accounts with role `user`"
		handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusForbidden)
		return
	}

	err = uc.Model.ChangeActiveStatus(input.UserID, input.Active)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"message": "OK"}, http.StatusOK)
}

func (uc userController) ChangeMyPassword(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value("undeuxUser").(*User)
	if !ok {
		msg := "no user has been found in the request context"
		handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusUnauthorized)
		return
	}

	var input OwnPasswordChangeSubmission

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = input.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	// Check that old password is correct
	if !matches(input.OldPasswordPlain, user.PasswordHash) {
		handlers.WriteJSON(w, handlers.Envelope{"error": "incorrect old password"}, http.StatusUnauthorized)
		return
	}

	err = uc.Model.ChangePassword(user.ID, input.NewPasswordPlain)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"message": "OK"}, http.StatusOK)
}

func (uc userController) ChangeUserPassword(w http.ResponseWriter, r *http.Request) {
	var input UserPasswordChangeSubmission

	err := handlers.ReadJSON(w, r, &input)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	err = input.Validate()
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	user, err := uc.Model.GetByID(input.ID)
	if err != nil {
		switch {
		case errors.Is(err, errs.ErrRecordNotFound):
			handlers.WriteJSON(w, handlers.Envelope{"error": "user not found"}, http.StatusNotFound)
		default:
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		}
		return
	}
	if user.Role != "user" {
		msg := "can only update accounts with role `user`"
		handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusForbidden)
		return
	}

	err = uc.Model.ChangePassword(input.ID, input.NewPasswordPlain)
	if err != nil {
		handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	handlers.WriteJSON(w, handlers.Envelope{"message": "OK"}, http.StatusOK)
}
