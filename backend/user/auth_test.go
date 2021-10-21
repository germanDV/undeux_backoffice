package user

import (
	"testing"
)

func TestCreateAndValidateToken(t *testing.T) {
	var token string
	var err error

	if err != nil {
		t.Fatalf("Error setting `JWT_TOKEN` env var.")
	}

	t.Run("Create token", func(t *testing.T) {
		token, err = createToken(99, "user")
		if err != nil {
			t.Fatalf("Expected no errors on token create, got %q.", err)
		}
	})

	t.Run("Decode and verify token", func(t *testing.T) {
		user, err := verifyToken(token)
		if err != nil {
			t.Errorf("Expected no errors verifying token, got %q.", err)
		}
		if user.ID != 99 {
			t.Errorf("Expected user ID to be 99, got %d", user.ID)
		}
	})
}
