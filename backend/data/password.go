package data

import (
	"golang.org/x/crypto/bcrypt"
)

// hash calculates the bcrypt hash of a plaintext password.
func hash(plain string, cost int) ([]byte, error) {
	return bcrypt.GenerateFromPassword([]byte(plain), cost)
}

// Matches checks whether the provided plaintext password matches the hashed password.
func Matches(candidate string, hash []byte) bool {
	err := bcrypt.CompareHashAndPassword(hash, []byte(candidate))
	if err != nil {
		return false
	}
	return true
}
