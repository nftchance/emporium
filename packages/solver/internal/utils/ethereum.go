package utils

import (
	"context"
	"fmt"
	"math/big"
	"os"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
)

var (
	ZeroAddress        = common.HexToAddress("0x0000000000000000000000000000000000000000")
	NativeTokenAddress = common.HexToAddress("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE")

	TokenStandards = []int{0, 20, 721, 1155}
	VaultStandards = []int{4626}

	Uint8Max   = new(big.Int).SetUint64(0xFF)
	Uint16Max  = new(big.Int).SetUint64(0xFFFF)
	Uint32Max  = new(big.Int).SetUint64(0xFFFFFFFF)
	Uint64Max  = new(big.Int).SetUint64(0xFFFFFFFFFFFFFFFF)
	Uint128Max = new(big.Int).Sub(new(big.Int).Lsh(big.NewInt(1), 128), big.NewInt(1))
	Uint256Max = new(big.Int).Sub(new(big.Int).Lsh(big.NewInt(1), 256), big.NewInt(1))

	SelectorLookup                   = "8063%s14"
	UpgradableImplementationSelector = "5c60da1b"

	NativeTransferGas = uint64(21000)

	// NOTE: 20 & 721 share the definition of transferFrom, but the it will hit for 20 before 721.
	TokenSelectors = []struct {
		Selector string
		Type     int
	}{
		{"a9059cbb", 20},   // 20 -- transfer(...)
		{"23b872dd", 721},  // 721 -- transferFrom(...)
		{"f242432a", 1155}, // 1155 -- safeTransferFrom(...)
	}
)

func GetChainName(chainId uint64) string {
	switch chainId {
	case 1:
		return "mainnet"
	case 8453:
		return "base"
	case 10:
		return "optimism-sepolia"
	case 31337:
		return "localhost"
	default:
		return "base"
	}
}

func GetProviderUrl(chainId uint64) (string, error) {
	if chainId == 31337 {
		return "http://127.0.0.1:8545", nil
	}

	quicknodeApiName := os.Getenv("QUICKNODE_API_NAME")
	quicknodeApiKey := os.Getenv("QUICKNODE_API_KEY")

	var chain string
	switch chainId {
	case 1:
		chain = ""
	case 8453:
		chain = "base-mainnet."
	case 84532:
		chain = "base-sepolia."
	case 10:
		chain = "optimism."
	case 11155420:
		chain = "optimism-sepolia."
	default:
		return "", ErrChainId("chainId", chainId)
	}

	return fmt.Sprintf("https://%v.%vquiknode.pro/%v", quicknodeApiName, chain, quicknodeApiKey), nil
}

func GetProvider(chainId uint64) (*ethclient.Client, error) {
	rpcUrl, err := GetProviderUrl(chainId)
	if err != nil {
		return nil, err
	}

	ethClient, err := ethclient.Dial(rpcUrl)
	if err != nil {
		return nil, ErrEthClient(err.Error())
	}

	return ethClient, nil
}

func BuildCallOpts(address string, value *big.Int) *bind.CallOpts {
	return &bind.CallOpts{
		From:    common.HexToAddress(address),
		Pending: true,
		Context: context.Background(),
	}
}

func BuildTransactionOpts(address string, value *big.Int) *bind.TransactOpts {
	return &bind.TransactOpts{
		From: common.HexToAddress(address),
		Signer: func(address common.Address, tx *types.Transaction) (*types.Transaction, error) {
			return tx, nil
		},
		NoSend: true,
		Value:  value,
	}
}

func FloatToUint(value float64, decimals uint8) (*big.Int, error) {
	result := new(big.Float).SetFloat64(value)

	multiplier := new(big.Int).Exp(
		big.NewInt(10),
		big.NewInt(int64(decimals)),
		nil,
	)

	result.Mul(result, new(big.Float).SetInt(multiplier))

	intValue, accuracy := result.Int(nil)
	if accuracy != big.Exact {
		return nil, fmt.Errorf("loss of precision when converting %v to uint with %d decimals", value, decimals)
	}

	return intValue, nil
}

func UintToFloat(value *big.Int, decimals uint8) float64 {
	if value == nil {
		return 0
	}

	floatValue := new(big.Float).SetInt(value)
	
	divisor := new(big.Float).SetInt(
		new(big.Int).Exp(
			big.NewInt(10),
			big.NewInt(int64(decimals)),
			nil,
		),
	)
	
	result := new(big.Float).Quo(floatValue, divisor)
	
	float64Value, _ := result.Float64()
	return float64Value
}

func StringToUint(value string, decimals uint8) (*big.Int, error) {
	parts := strings.Split(value, ".")
	if len(parts) > 2 {
		return nil, fmt.Errorf("invalid decimal number format: %s", value)
	}

	intPart, ok := new(big.Int).SetString(parts[0], 10)
	if !ok {
		return nil, fmt.Errorf("failed to parse %s as a decimal number", value)
	}

	multiplier := new(big.Int).Exp(
		big.NewInt(10),
		big.NewInt(int64(decimals)),
		nil,
	)

	result := new(big.Int).Mul(intPart, multiplier)

	if len(parts) == 2 {
		decimalPart := parts[1]
		if len(decimalPart) > int(decimals) {
			decimalPart = decimalPart[:decimals]
		} else {
			decimalPart = decimalPart + strings.Repeat("0", int(decimals)-len(decimalPart))
		}

		fraction, ok := new(big.Int).SetString(decimalPart, 10)
		if !ok {
			return nil, fmt.Errorf("failed to parse decimal part: %s", decimalPart)
		}
		result.Add(result, fraction)
	}

	if result.Sign() < 0 || result.Cmp(Uint256Max) > 0 {
		return nil, fmt.Errorf("failed to convert %s string amount to uint", value)
	}

	return result, nil
}

// UintToString converts a big.Int with given decimals into a string representation
func UintToString(value *big.Int, decimals uint8) string {
	if value == nil {
		return "0"
	}

	val := new(big.Int).Set(value)
	
	div := new(big.Int).Exp(big.NewInt(10), big.NewInt(int64(decimals)), nil)
	
	intPart := new(big.Int).Quo(val, div)
	fracPart := new(big.Int).Mod(val, div)
	
	fracStr := fracPart.String()
	// Pad with leading zeros if necessary
	fracStr = strings.Repeat("0", int(decimals)-len(fracStr)) + fracStr
	
	fracStr = strings.TrimRight(fracStr, "0")
	
	if fracStr == "" {
		return intPart.String()
	}
	
	return fmt.Sprintf("%s.%s", intPart.String(), fracStr)
}

func ParseAddressAndDecimals(input string) (address *common.Address, decimals uint8, err error) {
	parts := strings.Split(input, ":")
	if len(parts) != 2 {
		return nil, 0, fmt.Errorf("invalid input format: %s", input)
	}

	hexAddress := common.HexToAddress(parts[0])
	decimals64, err := strconv.ParseUint(parts[1], 10, 8)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to parse decimals: %v", err)
	}

	return &hexAddress, uint8(decimals64), nil
}
