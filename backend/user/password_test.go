package user

import "testing"

func TestPasswordHashingAndMatching(t *testing.T) {
	t.Run("matches when same password is provided", func(t *testing.T) {
		pass := "Pakito1q2w3e4r"
		hashed, err := hash(pass, 1)
		if err != nil {
			t.Fatal(err)
		}
		if !matches("Pakito1q2w3e4r", hashed) {
			t.Error("expected passwords to match.")
		}
	})

	t.Run("Does not match when different password is provided", func(t *testing.T) {
		pass := "Pakito1q2w3e4r"
		hashed, err := hash(pass, 1)
		if err != nil {
			t.Fatal(err)
		}
		if matches("Elpatiodemicasaesparticular", hashed) {
			t.Error("expected passwords not to match.")
		}
	})
}
