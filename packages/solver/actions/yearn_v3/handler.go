package yearn_v3

import (
	"solver/actions"
	"solver/types"
	"solver/utils"
)

var (
	name = "Yearn V3"
	icon = "https://cdn.onplug.io/protocols/yearn.png"
	tags = []string{"yield", "defi"}

	chains  = utils.Mainnet.ChainIds
	schemas = map[types.Action]actions.ActionDefinition{
		types.ActionDeposit: {
			Sentence: "Deposit {0<amount:float>} {1<token:address:uint8>} into {1=>2<vault:address>}.",
			Handler:  HandleActionDeposit,
		},
		types.ActionWithdraw: {
			Sentence: "Withdraw {0<amount:float>} {1<token:address:uint8>} from {1=>2<vault:address>}.",
			Handler:  HandleActionWithdraw,
		},
		// types.ActionWithdrawMax: {
		// 	Sentence: "Withdraw max {0<token:address>} from {0=>1<vault:address>}",
		// 	Handler:  HandleActionWithdrawMax,
		// },
		types.ActionStake: {
			Sentence: "Stake {0<amount:float>} {1<token:address:uint8>}",
			Handler:  HandleActionStake,
		},
		types.ActionStakeMax: {
			Sentence: "Stake max {0<token:address:uint8>}",
			Handler:  HandleActionStakeMax,
		},
		types.ActionRedeem: {
			Sentence: "Redeem {0<amount:float>} {1<token:address:uint8>}",
			Handler:  HandleActionRedeem,
		},
		types.ActionRedeemMax: {
			Sentence: "Redeem max staking rewards for {0<token:address:uint8>}",
			Handler:  HandleActionRedeemMax,
		},
		types.ConstraintAPY: {
			Type:     types.TypeConstraint,
			Sentence: "APY of {0<vault:address>} is {1<operator:int8>} than {2<threshold:float>}%.",
			Handler:  HandleConstraintAPY,
		},
	}
)

func New() actions.BaseProtocolHandler {
	return actions.NewBaseHandler(
		name,
		icon,
		tags,
		chains,
		schemas,
		&YearnV3OptionsProvider{},
	)
}
