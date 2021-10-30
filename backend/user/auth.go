package user

import (
	"errors"
	"fmt"
	"github.com/constructoraundeux/backoffice/config"
	"github.com/golang-jwt/jwt"
	"time"
)

// createToken generates a signed JWT.
func createToken(userID int, role string) (string, error) {
	secret := []byte(config.Config.Secret)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  userID,
		"role": role,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
		"iat":  time.Now().Unix(),
	})
	return token.SignedString(secret)
}

// verifyToken validates a JWT and returns the decoded data.
func verifyToken(t string) (*User, error) {
	secret := []byte(config.Config.Secret)

	decoded, err := jwt.Parse(t, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secret, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := decoded.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("unable to get claims from JWT")
	}

	if !decoded.Valid {
		return nil, errors.New("invalid JWT")
	}

	role, ok := claims["role"].(string)
	if !ok {
		return nil, errors.New("cannot read `role` from JWT")
	}

	id, ok := claims["sub"].(float64)
	if !ok {
		return nil, errors.New("cannot read `sub` from JWT")
	}

	user := &User{
		ID:   int(id),
		Role: role,
	}

	return user, nil
}
