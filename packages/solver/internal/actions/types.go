package actions

const (
	TypeAction     string = "action"
	TypeConstraint string = "constraint"

	ProtocolPlug    string = "plug"
	ProtocolAaveV3  string = "aave_v3"
	ProtocolYearnV3 string = "yearn_v3"
	ProtocolNouns   string = "nouns"
	ProtocolENS     string = "ens"
	ProtocolMorpho  string = "morpho"
	ProtocolBebop   string = "bebop"
	ProtocolEuler   string = "euler"

	ActionDeposit      string = "deposit"
	ActionBorrow       string = "borrow"
	ActionRedeem       string = "redeem"
	ActionRedeemMax    string = "redeem_max"
	ActionWithdraw     string = "withdraw"
	ActionWithdrawMax  string = "withdraw_max"
	ActionRepay        string = "repay"
	ActionHarvest      string = "harvest"
	ActionTransfer     string = "transfer"
	ActionTransferFrom string = "transfer_from"
	ActionApprove      string = "approve"
	ActionSwap         string = "swap"
	ActionRoute        string = "route"
	ActionStake        string = "stake"
	ActionStakeMax     string = "stake_max"
	ActionBuy          string = "buy"
	ActionBid          string = "bid"
	ActionRenew        string = "renew"

	ConstraintHealthFactor       string = "health_factor"
	ConstraintAPY                string = "apy"
	ConstraintAPYDifferential    string = "apy_differential"
	ConstraintAvailableLiquidity string = "available_liquidity"
	ConstraintTimeLeft           string = "time_left"
	ConstraintPrice              string = "price"
	ConstraintBalance            string = "balance"
)
