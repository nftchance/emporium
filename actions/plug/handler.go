package plug

import (
	"encoding/json"
	"fmt"
	"solver/actions"
	"solver/types"
)

type Handler struct {
	schemas map[types.Action]types.Schema
	actions.Protocol
}

func New() actions.BaseProtocolHandler {
	h := &Handler{
		schemas: make(map[types.Action]types.Schema),
		Protocol: actions.Protocol{
			Name:   "Plug",
			Icon:   "https://onplug.io/favicon.ico",
			Tags:   []string{"defi"},
			Chains: []int{1},
		},
	}
	h.Protocol.SchemaProvider = h
	return h.init()
}

func (h *Handler) init() *Handler {
	transferFields := []types.SchemaField{
		{
			Name: "amount",
			Type: "uint256",
		},
		{
			Name: "token",
			Type: "address",
		},
		{
			Name: "recipient",
			Type: "address",
		},
	}

	h.schemas[types.ActionTransfer] = types.Schema{
		Sentence: "Transfer {0} {1} to {2}.",
		Fields:   transferFields,
	}

	h.schemas[types.ActionTransferFrom] = types.Schema{
		Sentence: "Transfer {0} {1} to {2}.",
		Fields:   transferFields,
	}

	return h
}

func (h *Handler) GetSchemas() map[types.Action]types.Schema {
	return h.schemas
}

func (h *Handler) GetSchema(action types.Action) (*types.Schema, error) {
	schema, exists := h.schemas[action]
	if !exists {
		return nil, fmt.Errorf("unsupported action: %s", action)
	}
	return &schema, nil
}

func (h *Handler) GetTransaction(action types.Action, rawInputs json.RawMessage, params actions.HandlerParams) ([]*types.Transaction, error) {
	switch action {
	case types.ActionTransfer:
		return HandleTransfer(rawInputs, params)
	case types.ActionTransferFrom:
		return HandleTransferFrom(rawInputs, params)
	default:
		return nil, fmt.Errorf("unsupported action: %s", action)
	}
}
