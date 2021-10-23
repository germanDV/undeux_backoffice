package user

import (
	"context"
	"github.com/constructoraundeux/backoffice/handlers"
	"net/http"
	"strings"
)

func (uc userController) Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Authorization")
		authHeader := r.Header.Get("Authorization")
		headerParts := strings.Split(authHeader, " ")

		if authHeader == "" || len(headerParts) != 2 || headerParts[0] != "Bearer" {
			uc.L.Println("Auth Middleware: no token provided")
			w.Header().Set("WWW-Authenticate", "Bearer")
			msg := "invalid or missing authentication token"
			handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusUnauthorized)
			return
		}

		token := headerParts[1]
		partialUser, err := verifyToken(token)
		if err != nil {
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusUnauthorized)
			return
		}

		// Check if user has desired role (or do another mdw for that 🤔?)
		// Role is available here before reading from the database in `partialUser.Role`

		user, err := uc.Model.GetByID(partialUser.ID)
		if err != nil {
			handlers.WriteJSON(w, handlers.Envelope{"error": err.Error()}, http.StatusUnauthorized)
			return
		}

		if !user.Active {
			msg := "account has been deactivated"
			handlers.WriteJSON(w, handlers.Envelope{"error": msg}, http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "undeuxID", user.ID)
		ctx = context.WithValue(ctx, "undeuxUser", user)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
