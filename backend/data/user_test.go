package data

import "testing"

func TestUserValidation(t *testing.T) {
	t.Run("good user (role=admin)", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Name: "German",
			Role: "admin",
			PasswordPlain: "Abc123456789",
			Active: true,
		}

		err := u.Validate()
		if err != nil {
			t.Fatal(err)
		}
	})

	t.Run("good user (role=user)", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Name: "German",
			Role: "user",
			PasswordPlain: "Abc123456789",
			Active: false,
		}

		err := u.Validate()
		if err != nil {
			t.Fatal(err)
		}
	})

	t.Run("good user (without `Active` field", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Name: "German",
			Role: "admin",
			PasswordPlain: "Abc123456789",
		}

		err := u.Validate()
		if err != nil {
			t.Fatal(err)
		}
	})

	t.Run("invalid email address", func(t *testing.T) {
		u := &User{
			Email: "german@undeux",
			Name: "German",
			Role: "user",
			PasswordPlain: "Abc123456789",
		}

		err := u.Validate()
		if err == nil {
			t.Fatal("Expected error due to invalid email address.")
		}
	})

	t.Run("missing name", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Role: "user",
			PasswordPlain: "Abc123456789",
		}

		err := u.Validate()
		if err == nil {
			t.Fatal("Expected error due to missing name.")
		}
	})

	t.Run("name too short", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Name: "G",
			Role: "user",
			PasswordPlain: "Abc123456789",
		}

		err := u.Validate()
		if err == nil {
			t.Fatal("Expected error due to name too short.")
		}
	})

	t.Run("name too long", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Name: "German alalalnewrpoisadfbnkjlsdfopiaefnaasdfnasferqbnaiubasab",
			Role: "user",
			PasswordPlain: "Abc123456789",
		}

		err := u.Validate()
		if err == nil {
			t.Fatal("Expected error due to name too long.")
		}
	})

	t.Run("missing password", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Role: "user",
			Name: "German",
		}

		err := u.Validate()
		if err == nil {
			t.Fatal("Expected error due to missing password.")
		}
	})

	t.Run("password too short", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Name: "German",
			Role: "user",
			PasswordPlain: "Abc123",
		}

		err := u.Validate()
		if err == nil {
			t.Fatal("Expected error due to password too short.")
		}
	})

	t.Run("password too long", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Name: "German",
			Role: "user",
			PasswordPlain: "Abc123456789alalalnewrpoisadfbnkjlsdfopiaefnaasdfnasferqbnaiubasab",
		}

		err := u.Validate()
		if err == nil {
			t.Fatal("Expected error due to password too long.")
		}
	})

	t.Run("missing role", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Name: "German",
			PasswordPlain: "Abc123456789",
		}

		err := u.Validate()
		if err == nil {
			t.Fatal("Expected error due to missing role.")
		}
	})

	t.Run("invalid role", func(t *testing.T) {
		u := &User{
			Email: "german@undeux.com",
			Name: "German",
			Role: "superhero",
			PasswordPlain: "Abc123456789",
		}

		err := u.Validate()
		if err == nil {
			t.Fatal("Expected error due to invalid role.")
		}
	})
}
