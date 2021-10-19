package data

import "testing"

func TestPasswordHashingAndMatching(t *testing.T) {
	t.Run("Matches when same password is provided", func(t *testing.T) {
		pass := "Pakito1q2w3e4r"
		hashed, err := hash(pass, 1)
		if err != nil {
			t.Fatal(err)
		}
		if !Matches("Pakito1q2w3e4r", hashed) {
			t.Error("expected passwords to match.")
		}
	})

	t.Run("Does not match when different password is provided", func(t *testing.T) {
		pass := "Pakito1q2w3e4r"
		hashed, err := hash(pass, 1)
		if err != nil {
			t.Fatal(err)
		}
		if Matches("Elpatiodemicasaesparticular", hashed) {
			t.Error("expected passwords not to match.")
		}
	})
}
