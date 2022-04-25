package handlers

import (
	"github.com/constructoraundeux/backoffice/config"
	"github.com/tomasen/realip"
	"golang.org/x/time/rate"
	"net/http"
	"sync"
	"time"
)

func (h *Handler) RateLimiter(next http.Handler) http.Handler {
	// The code before the handler will not be executed for every request, it'll run only once.
	type client struct {
		limiter  *rate.Limiter
		lastSeen time.Time
	}

	// Map to keep track of requests per client.
	var clients = make(map[string]*client)

	// Mutex to safely update the clients map.
	var mu sync.Mutex

	// goroutine to remove old entries (> 3') from the clients map.
	go func() {
		for {
			time.Sleep(time.Minute)
			mu.Lock()
			for ip, client := range clients {
				if time.Since(client.lastSeen) > 3*time.Minute {
					delete(clients, ip)
				}
			}
			mu.Unlock()
		}
	}()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if config.Config.LimiterEnabled {
			ip := realip.FromRequest(r)
			mu.Lock()

			if _, found := clients[ip]; !found {
				// Add new client to the map and set a fresh limiter.
				rps := rate.Limit(config.Config.LimiterRPS)
				burst := config.Config.LimiterBurst
				clients[ip] = &client{limiter: rate.NewLimiter(rps, burst)}
			}

			// Update last seen time.
			clients[ip].lastSeen = time.Now()

			// Check if client has exceeded the limit.
			if !clients[ip].limiter.Allow() {
				mu.Unlock()
				h.L.Printf("Client IP %s has exceeded the rate limit.\n", ip)
				WriteJSON(w, Envelope{"message": "Exceeded rate limit."}, http.StatusTooManyRequests)
				return
			}

			mu.Unlock()
			next.ServeHTTP(w, r)
		}
	})
}
