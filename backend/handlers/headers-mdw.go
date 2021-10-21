package handlers

import "net/http"

// source: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#security-headers
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Prevent sensitive information from being cached.
		w.Header().Set("Cache-Control", "no-store")

		// To protect against drag-and-drop style clickjacking attacks.
		w.Header().Set("Content-Security-Policy", "frame-ancestors 'none'")
		w.Header().Set("X-Frame-Options", "DENY")

		// To prevent browsers from performing MIME sniffing, and inappropriately interpreting responses as HTML.
		w.Header().Set("X-Content-Type-Options", "nosniff")

		// Require connections over HTTPS and to protect against spoofed certificates.
		w.Header().Set("Strict-Transport-Security", "max-age=31536000")

		next.ServeHTTP(w, r)
	})
}
