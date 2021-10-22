package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

type config struct {
	Secret      string
	Env         string
	Port        uint
	DatabaseDSN string
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

	Config = config{
		Secret:      secret,
		Env:         env,
		Port:        uint(port),
		DatabaseDSN: os.Getenv("DATABASE_URL"),
	}
}
