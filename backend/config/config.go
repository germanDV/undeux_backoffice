package config

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type config struct {
	Secret         string
	Env            string
	Port           uint
	DatabaseDSN    string
	BcraToken      string
	LimiterEnabled bool
	LimiterRPS     int
	LimiterBurst   int
}

var Config config

func init() {
	_ = godotenv.Load(".env")

	env := os.Getenv("ENV")
	if env == "" {
		env = "testing"
	}

	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil || port == 0 {
		port = 8080
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" && env != "testing" {
		log.Fatalln("Environment variable `JWT_SECRET` must be provided to sign JWTs.")
	}

	limiterEnabledStr := os.Getenv("ENABLE_LIMITER")
	limiterEnabled := true
	if strings.ToLower(limiterEnabledStr) == "false" || strings.ToLower(limiterEnabledStr) == "no" {
		limiterEnabled = false
	}

	rps, err := strconv.Atoi(os.Getenv("LIMITER_RPS"))
	if err != nil || rps == 0 {
		rps = 100
	}

	burst, err := strconv.Atoi(os.Getenv("LIMITER_BURST"))
	if err != nil || rps == 0 {
		burst = 25
	}

	Config = config{
		Secret:         secret,
		Env:            env,
		Port:           uint(port),
		DatabaseDSN:    os.Getenv("DATABASE_URL"),
		BcraToken:      os.Getenv("BCRA_TOKEN"),
		LimiterEnabled: limiterEnabled,
		LimiterRPS:     rps,
		LimiterBurst:   burst,
	}
}
