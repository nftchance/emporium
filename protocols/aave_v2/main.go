package aave_v2

import (
	"math/big"
	"solver/bindings/aave_v2_pool"
	"solver/types"
	"solver/utils"

	"github.com/ethereum/go-ethereum/common"
	ethtypes "github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

var (
	Key = "aave_v2"

	address          = utils.Mainnet.References[Key]["pool"]
	hexAddress       = common.HexToAddress(address)
	interestRateMode = new(big.Int).SetUint64(2)
)

func GetDeposit(i types.DepositInputs, provider *ethclient.Client, chainId int) (*types.ActionSchema, error) {
	return &types.ActionSchema{
		Protocol: Key,
		Type:     "deposit",
		Values: []types.ActionSchemaValues{
			{
				Label: "tokenOut",
				Type:  "address",
			},
			{
				Label: "amountOut",
				Type:  "uint256",
			},
		},
	}, nil
}

func BuildDeposit(i types.DepositInputs, provider *ethclient.Client, chainId int, from string) ([]*ethtypes.Transaction, error) {
	contract, err := aave_v2_pool.NewAaveV2Pool(hexAddress, provider)
	if err != nil {
		return nil, utils.ErrContractFailed(address)
	}

	deposit, err := contract.Deposit(
		utils.BuildTransactionOpts(from, big.NewInt(0)),
		common.HexToAddress(i.GetTokenOut()),
		i.GetAmountIn(),
		common.HexToAddress(from),
		uint16(0),
	)
	return []*ethtypes.Transaction{deposit}, err
}

func GetBorrow(i types.BorrowInputs, provider *ethclient.Client, chainId int) (*types.ActionSchema, error) {
	return &types.ActionSchema{
		Protocol: Key,
		Type:     "borrow",
		Values: []types.ActionSchemaValues{
			{
				Label: "tokenOut",
				Type:  "address",
			},
			{
				Label: "amountOut",
				Type:  "uint256",
			},
		},
	}, nil
}

func PostBorrow(i types.BorrowInputs, provider *ethclient.Client, chainId int, from string) (*ethtypes.Transaction, error) {
	contract, err := aave_v2_pool.NewAaveV2Pool(hexAddress, provider)
	if err != nil {
		return nil, utils.ErrContractFailed(address)
	}

	return contract.Borrow(
		utils.BuildTransactionOpts(from, big.NewInt(0)),
		common.HexToAddress(i.GetTokenOut()),
		i.GetAmountOut(),
		interestRateMode,
		uint16(0),
		common.HexToAddress(from),
	)
}

func GetRedeem(i types.RedeemInputs, provider *ethclient.Client, chainId int) (*types.ActionSchema, error) {
	return &types.ActionSchema{
		Protocol: Key,
		Type:     "redeem",
		Values: []types.ActionSchemaValues{
			{
				Label: "tokenOut",
				Type:  "address",
			},
			{
				Label: "amountOut",
				Type:  "uint256",
			},
		},
	}, nil
}

func PostRedeem(i types.RedeemInputs, provider *ethclient.Client, chainId int, from string) ([]*ethtypes.Transaction, error) {
	contract, err := aave_v2_pool.NewAaveV2Pool(hexAddress, provider)
	if err != nil {
		return nil, utils.ErrContractFailed(address)
	}

	redeem, err := contract.Withdraw(
		utils.BuildTransactionOpts(from, big.NewInt(0)),
		common.HexToAddress(i.GetTokenIn()),
		i.GetAmountIn(),
		common.HexToAddress(from),
	)
	return []*ethtypes.Transaction{redeem}, err
}

func GetRepay(i types.RepayInputs, provider *ethclient.Client, chainId int) (*types.ActionSchema, error) {
	return &types.ActionSchema{
		Protocol: Key,
		Type:     "repay",
		Values: []types.ActionSchemaValues{
			{
				Label: "tokenOut",
				Type:  "address",
			},
			{
				Label: "amountOut",
				Type:  "uint256",
			},
		},
	}, nil
}

func PostRepay(i types.RepayInputs, provider *ethclient.Client, chainId int, from string) (*ethtypes.Transaction, error) {
	contract, err := aave_v2_pool.NewAaveV2Pool(hexAddress, provider)
	if err != nil {
		return nil, utils.ErrContractFailed(address)
	}

	return contract.Repay(
		utils.BuildTransactionOpts(from, big.NewInt(0)),
		common.HexToAddress(i.GetTokenIn()),
		i.GetAmountIn(),
		interestRateMode,
		common.HexToAddress(from),
	)
}
