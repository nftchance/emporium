package zerion

import (
	"fmt"
	"os"
	"solver/internal/utils"
	"strings"
)

type ZerionTokenImplementation struct {
	Chain    string `json:"chain"`
	Contract string `json:"contract"`
	ChainID  string `json:"chain_id"`
	Address  string `json:"address"`
	Decimals int    `json:"decimals"`
}

type ZerionToken struct {
	Price           float64                     `json:"price"`
	Change          float64                     `json:"change"`
	Implementations []ZerionTokenImplementation `json:"implementations"`
	Name            string                      `json:"name"`
	Symbol          string                      `json:"symbol"`
	Icon            *string                     `json:"icon,omitempty"`
	Flags           struct {
		Verified bool `json:"verified"`
	} `json:"flags"`
	MarketData struct {
		Price   float64 `json:"price"`
		Changes struct {
			Percent1D float64 `json:"percent_1d"`
		} `json:"changes"`
	} `json:"market_data"`
}

type ZerionPosition struct {
	ID         string `json:"id"`
	Attributes struct {
		PositionType string `json:"position_type"`
		Quantity     struct {
			Float float64 `json:"float"`
		} `json:"quantity"`
		FungibleInfo struct {
			Name   string `json:"name"`
			Symbol string `json:"symbol"`
			Icon   *struct {
				URL string `json:"url"`
			} `json:"icon"`
			Flags struct {
				Verified bool `json:"verified"`
			} `json:"flags"`
			Implementations []ZerionTokenImplementation `json:"implementations"`
		} `json:"fungible_info"`
		ApplicationMetadata *struct {
			Name string `json:"name"`
			Icon *struct {
				URL string `json:"url"`
			} `json:"icon"`
			URL string `json:"url"`
		} `json:"application_metadata"`
	} `json:"attributes"`
	Relationships struct {
		Chain struct {
			Data struct {
				ID string `json:"id"`
			} `json:"data"`
		} `json:"chain"`
	} `json:"relationships"`
}

func GetFungiblePositions(chains []string, socketID, socketAddress string) ([]ZerionPosition, error) {
	address := socketAddress
	if address == "" {
		address = socketID
	}

	url := fmt.Sprintf(
		"https://api.zerion.io/v1/wallets/%s/positions/?filter[positions]=no_filter&currency=usd&filter[chain_ids]=%s&filter[trash]=only_non_trash&sort=value",
		address,
		strings.Join(chains, ","),
	)

	response, err := utils.MakeHTTPRequest(
		url,
		"GET",
		map[string]string{
			"accept":        "application/json",
			"authorization": fmt.Sprintf("Basic %v", os.Getenv("ZERION_API_KEY")),
		},
		nil,
		nil,
		struct {
			Data []ZerionPosition `json:"data"`
		}{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get zerion positions: %w", err)
	}

	return response.Data, nil
}

func GetFungibles(search string, chains []string) ([]ZerionToken, error) {
	if len(chains) == 0 {
		chains = []string{"base"}
	}

	url := fmt.Sprintf(
		"https://api.zerion.io/v1/fungibles/?currency=usd&page[size]=100&filter[search_query]=%s&sort=-market_data.market_cap&filter[implementation_chain_id]=%s",
		search, strings.Join(chains, ","),
	)

	response, err := utils.MakeHTTPRequest(
		url,
		"GET",
		map[string]string{
			"accept":        "application/json",
			"authorization": fmt.Sprintf("Basic %v", os.Getenv("ZERION_API_KEY")),
		},
		nil,
		nil,
		struct {
			Data []struct {
				Attributes ZerionToken `json:"attributes"`
			} `json:"data"`
		}{},
	)
	if err != nil {
		return nil, err
	}

	var tokens []ZerionToken
	for _, item := range response.Data {
		tokens = append(tokens, item.Attributes)
	}
	return tokens, nil
}
