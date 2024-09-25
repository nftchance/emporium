package actions

import (
	"math/big"
	"solver/protocols/aave_v3"
	"solver/types"
	"solver/utils"
)

type RedeemInputsImpl struct {
	Protocol string  `json:"protocol"` // Slug of the protocol to use.
	TokenIn  string  `json:"tokenIn"`  // Address of the token to send (redeem).
	TokenOut string  `json:"tokenOut"` // Address of the token to receive (redeeming for).
	AmountIn big.Int `json:"amountIn"` // Raw amount of tokens to send.
}

func (i *RedeemInputsImpl) Validate() error {
	if !utils.IsAddress(i.TokenIn) {
		return utils.ErrInvalidAddress("tokenIn", i.TokenIn)
	}
	if !utils.IsAddress(i.TokenOut) {
		return utils.ErrInvalidAddress("tokenOut", i.TokenOut)
	}
	if !utils.IsUint(i.AmountIn.String(), 256) {
		return utils.ErrInvalidUint("amountIn", i.AmountIn.String(), 256)
	}

	return nil
}

func (i *RedeemInputsImpl) Build(chainId int, from string) (*types.Transaction, error) {
	switch i.Protocol { 
	case aave_v3.Key:
		return aave_v3.BuildRedeem(i, chainId, from)
	default:
		return nil, utils.ErrInvalidProtocol("protocol", i.Protocol)
	}
}

func (i *RedeemInputsImpl) GetProtocol() string   { return i.Protocol }
func (i *RedeemInputsImpl) GetTokenIn() string    { return i.TokenIn }
func (i *RedeemInputsImpl) GetTokenOut() string   { return i.TokenOut }
func (i *RedeemInputsImpl) GetAmountIn() *big.Int { return new(big.Int).Set(big.NewInt(0)) }
