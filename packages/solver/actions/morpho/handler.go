package morpho

import (
	"encoding/json"
	"fmt"
	"solver/actions"
	"solver/types"
)

var (
	ActionSupplyCollateral      = "supply_collateral"
	ActionWithdrawCollateral    = "withdraw_collateral"
	ActionWithdrawMaxCollateral = "withdraw_max_collateral"
	ActionBorrow                = "borrow"
	ActionRepay                 = "repay"
	ActionRepayMax              = "repay_max"
	ActionClaimRewards          = "claim_rewards"
	ConstraintLLTV              = "lltv"
	ConstraintAPY               = "apy"
)

type Handler struct {
	schemas map[types.Action]types.Schema
	actions.Protocol
}

func New() actions.BaseProtocolHandler {
	h := &Handler{
		schemas: make(map[types.Action]types.Schema),
		Protocol: actions.Protocol{
			Name:   "Morpho",
			Icon:   "https://morpho.org/butterfly-light.png",
			Tags:   []string{"lending", "defi"},
			Chains: []int{1},
		},
	}
	h.Protocol.SchemaProvider = h
	return h.init()
}

func (h *Handler) init() *Handler {
	collateralOptions, collateralToMarketOptions, err := GetCollateralTokenToMarketOptions()
	if err != nil {
		return nil
	}
	borrowOptions, borrowToMarketOptions, err := GetBorrowTokenToMarketOptions()
	if err != nil {
		return nil
	}

	marketOptions, err := GetMarketOptions()
	if err != nil {
		return nil
	}

	h.schemas[types.Action(ActionSupplyCollateral)] = types.Schema{
		Sentence: "Supply {0<amount:uint256>} {1<token:address>} as collateral to {1=>2<market:string>}.",
		Options: map[int]types.SchemaOptions{
			1: {Simple: collateralOptions},
			2: {Complex: collateralToMarketOptions},
		},
	}
	h.schemas[types.Action(ActionWithdrawCollateral)] = types.Schema{
		Sentence: "Withdraw {0<amount:uint256>} {1<token:address>} from {1=>2<market:string>}.",
		Options: map[int]types.SchemaOptions{
			1: {Simple: collateralOptions},
			2: {Complex: collateralToMarketOptions},
		},
	}
	h.schemas[types.Action(ActionWithdrawMaxCollateral)] = types.Schema{
		Sentence: "Withdraw max collateral from {0<market:string>}.",
		Options: map[int]types.SchemaOptions{
			0: {Simple: marketOptions},
		},
	}
	h.schemas[types.Action(ActionBorrow)] = types.Schema{
		Sentence: "Borrow {0<amount:uint256>} {1<token:address>} from {1=>2<target:string>}.",
		Options: map[int]types.SchemaOptions{
			1: {Simple: borrowOptions},
			2: {Complex: borrowToMarketOptions},
		},
	}
	h.schemas[types.Action(ActionRepay)] = types.Schema{
		Sentence: "Repay {0<amount:uint256>} {1<token:address>} to {1=>2<target:address>}.",
		Options: map[int]types.SchemaOptions{
			1: {Simple: borrowOptions},
			2: {Complex: borrowToMarketOptions},
		},
	}
	h.schemas[types.Action(ActionRepayMax)] = types.Schema{
		Sentence: "Repay max {0<token:address>} to {0=>1<target:address>}.",
		Options: map[int]types.SchemaOptions{
			0: {Simple: borrowOptions},
			1: {Complex: borrowToMarketOptions},
		},
	}
	h.schemas[types.Action(ActionClaimRewards)] = types.Schema{
		Sentence: "Claim all reward distributions.",
	}
	h.schemas[types.ConstraintHealthFactor] = types.Schema{
		Sentence: "Health factor in {0<target:string>} is {1<operator:int8>} than {2<threshold:uint256>}.",
		Options: map[int]types.SchemaOptions{
			0: {Simple: marketOptions},
			1: {Simple: types.BaseThresholdFields},
		},
	}
	h.schemas[types.Action(ConstraintAPY)] = types.Schema{
		Sentence: "{0<action:int8>} APY in {1<target:string>} is {2<operator:int8>} than {3<threshold:uint256>}%.",
		Options: map[int]types.SchemaOptions{
			0: {Simple: types.BaseBorowFields},
			1: {Simple: marketOptions},
			2: {Simple: types.BaseThresholdFields},
		},
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
	case types.Action(ActionSupplyCollateral):
		return HandleSupplyCollateral(rawInputs, params)
	case types.Action(ActionWithdrawCollateral):
		return HandleWithdrawCollateral(rawInputs, params)
	case types.Action(ActionWithdrawMaxCollateral):
		return HandleWithdrawMaxCollateral(rawInputs, params)
	case types.Action(ActionBorrow):
		return HandleBorrow(rawInputs, params)
	case types.Action(ActionRepay):
		return HandleRepay(rawInputs, params)
	case types.Action(ActionRepayMax):
		return HandleRepayMax(rawInputs, params)
	case types.Action(ActionClaimRewards):
		return HandleClaimRewards(rawInputs, params)
	case types.Action(ConstraintLLTV):
		return HandleConstraintAPY(rawInputs, params)
	case types.ConstraintAPY:
		return HandleConstraintAPY(rawInputs, params)
	default:
		return nil, fmt.Errorf("unsupported action: %s", action)
	}
}
