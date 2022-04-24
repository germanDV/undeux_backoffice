package fx

import (
	"fmt"
	"net/http"

	"github.com/constructoraundeux/backoffice/config"
	"gitlab.com/germanDV/axgos/axgos"
)

var client axgos.Client

type BCRARate struct {
	D string  `json:"d"`
	V float64 `json:"v"`
}

func init() {
	headers := make(http.Header)
	headers.Set("Content-Type", "application/json")
	headers.Set("Accept", "application/json")
	headers.Set("Authorization", fmt.Sprintf("Bearer %s", config.Config.BcraToken))

	client = axgos.
		NewBuilder().
		SetBaseURL("https://api.estadisticasbcra.com").
		SetHeaders(headers).
		Build()
}

func fetchRate() (float64, error) {
	res, err := client.Get("/usd")
	if err != nil {
		return 0, err
	}

	if !res.OK() {
		return 0, fmt.Errorf("BCRA API returned an error: %d %q\n", res.StatusCode, res.String())
	}

	var rates []BCRARate
	err = res.Unmarshal(&rates)
	if err != nil {
		return 0, err
	}

	lastIdx := len(rates) - 1
	return rates[lastIdx].V, nil
}
