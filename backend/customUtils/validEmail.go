package customutils

import (
	emailverifier "github.com/AfterShip/email-verifier"
)

var (
	verifier = emailverifier.NewVerifier()
)

func ValidateEmail(email string) bool {
	ret, err := verifier.Verify(email)
	if err != nil {
		return false
	}
	if !ret.Syntax.Valid {
		return false
	}
	return true
}
