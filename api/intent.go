package api

import (
	"encoding/json"
	"log"
	"net/http"
	"solver/intent"
	"solver/types"
	"solver/utils"
)

func GetIntent(w http.ResponseWriter, r *http.Request) {
	var intentRequest intent.IntentRequest
	if err := json.NewDecoder(r.Body).Decode(&intentRequest); err != nil {
		utils.Error(w, utils.ServerError{Message: "Invalid request payload"}, http.StatusBadRequest)
		return
	}

	if err := intentRequest.Validate(); err != nil {
		utils.Error(w, err, http.StatusBadRequest)
		return
	}

	provider, err := utils.GetProvider(intentRequest.ChainId)
	if err != nil {
		log.Fatalf("failed to connect to Ethereum node: %v", err)
	}

	var transactions []types.Transaction
	for _, action := range intentRequest.Actions {
		inputs, err := intent.ParseAction(action)
		if err != nil {
			utils.Error(w, err, http.StatusBadRequest)
			return
		}

		transaction, err := inputs.Build(provider, intentRequest.ChainId, intentRequest.From)
		if err != nil {
			utils.Error(w, err, http.StatusBadRequest)
			return
		}

		transactions = append(transactions, *transaction)
	}

	intentResponse := intent.IntentResponse{
		Request:      intentRequest,
		Transactions: transactions,
	}

	if err := json.NewEncoder(w).Encode(intentResponse); err != nil {
		utils.Error(w, err, http.StatusInternalServerError)
		return
	}
}
