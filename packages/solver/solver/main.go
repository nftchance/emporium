package solver

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"solver/actions"
	"solver/actions/aave_v3"
	"solver/actions/ens"
	"solver/actions/morpho"
	"solver/actions/nouns"
	"solver/actions/plug"
	"solver/actions/yearn_v3"
	"solver/types"
	"solver/utils"
)

type Solver struct {
	protocols map[types.Protocol]actions.BaseProtocolHandler
}

func New() *Solver {
	return &Solver{
		protocols: map[types.Protocol]actions.BaseProtocolHandler{
			types.ProtocolPlug:    plug.New(),
			types.ProtocolAaveV3:  aave_v3.New(),
			types.ProtocolYearnV3: yearn_v3.New(),
			types.ProtocolENS:     ens.New(),
			types.ProtocolNouns:   nouns.New(),
			types.ProtocolMorpho:  morpho.New(),
		},
	}
}

func (s *Solver) GetProtocols() map[types.Protocol]actions.BaseProtocolHandler {
	return s.protocols
}

func (s *Solver) GetProtocolHandler(protocol types.Protocol) (actions.BaseProtocolHandler, bool) {
	handler, exists := s.protocols[protocol]
	return handler, exists
}

func (s *Solver) GetSupportedProtocols(action types.Action) []types.Protocol {
	supported := make([]types.Protocol, 0)
	for protocol, handler := range s.protocols {
		for _, supportedAction := range handler.GetActions() {
			if supportedAction == action {
				supported = append(supported, protocol)
				break
			}
		}
	}
	return supported
}

func (s *Solver) GetExecutions() (ExecutionsRequest, error) {
	url := fmt.Sprintf("%s%s", os.Getenv("PLUG_APP_API_URL"), "jobs.simulation.simulateNext")
	response, err := utils.MakeHTTPRequest(
		url,
		"POST",
		map[string]string{
			"Content-Type": "application/json",
			"X-API-Key":    os.Getenv("PLUG_APP_API_KEY"),
		},
		nil,
		nil,
		ExecutionsRequest{},
	)
	if err != nil {
		return response, err
	}
	return response, nil
}

func (s *Solver) GetTransaction(rawInputs json.RawMessage, chainId int, from string) ([]*types.Transaction, error) {
	var inputs types.BaseInputs
	if err := json.Unmarshal(rawInputs, &inputs); err != nil {
		return nil, fmt.Errorf("failed to unmarshal base inputs: %v", err)
	}

	if err := inputs.Validate(); err != nil {
		return nil, err
	}

	handler, exists := s.protocols[inputs.Protocol]
	if !exists {
		return nil, fmt.Errorf("unsupported protocol: %s", inputs.Protocol)
	}

	provider, err := utils.GetProvider(chainId)
	if err != nil {
		return nil, fmt.Errorf("failed to get provider: %v", err)
	}

	params := actions.HandlerParams{
		Provider: provider,
		ChainId:  chainId,
		From:     from,
	}

	return handler.GetTransaction(inputs.Action, rawInputs, params)
}

func (s *Solver) GetTransactions(execution ExecutionRequest) ([]*types.Transaction, error) {
	var breakOuter bool
	transactionsBatch := make([]*types.Transaction, 0)
	errors := make([]error, len(execution.Inputs))
	for i, input := range execution.Inputs {
		inputMap := map[string]interface{}{
			"protocol": input["protocol"],
			"action":   input["action"],
		}
		for k, v := range input {
			inputMap[k] = v
		}

		inputsJson, err := json.Marshal(inputMap)
		if err != nil {
			errors[i] = err
			continue
		}

		transactions, err := s.GetTransaction(inputsJson, execution.ChainId, execution.From)
		if err != nil {
			errors[i] = err
			continue
		}

		// NOTE: Some plug actions have exclusive transactions that need to be run alone
		//       before the rest of the Plug can run. For this, we will just break out
		//       of the loop and execute any solo transactions that are needed for
		//       the rest of the batch to run in sequence.
		for _, transaction := range transactions {
			if transaction.Exclusive {
				// NOTE: Set the field to false to avoid tarnishing the response shape.
				transaction.Exclusive = false
				transactionsBatch = []*types.Transaction{transaction}
				breakOuter = true
				break
			}
		}

		if breakOuter {
			break
		}

		transactionsBatch = append(transactionsBatch, transactions...)
	}

	// If there were any errors we will return a failure.
	for _, err := range errors {
		if err != nil {
			return nil, utils.ErrBuildFailed(err.Error())
		}
	}

	// If there was no transaction to execute we will return a warning because
	// we will be halting the simulation of this workflow.
	if len(transactionsBatch) == 0 {
		return nil, utils.ErrBuildFailed("no transactions to execute")
	}

	return transactionsBatch, nil
}

func (s *Solver) GetSimulation(id string, transactions []*types.Transaction) (SimulationRequest, error) {
	// NOTE: If there was no transaction to execute we will return a warning because
	//       we will be halting the simulation of this workflow.
	if len(transactions) == 0 {
		return SimulationRequest{
			Id:     id,
			Status: "warning",
			Error:  "has no transactions to execute",
		}, nil
	}

	// NOTE: This is where we will pick back up for simulation integration.
	// TODO: This is where we would simulate the transaction and return a real
	//       simulation response however for now we are just returning everything
	//       as a success if it made it this far.

	return SimulationRequest{
		Id:          id,
		Status:      "success",
		GasEstimate: 100000,
	}, nil
}

func (s *Solver) GetRun(transactions []*types.Transaction) {
	// TODO: Run the transactions through the entrypoint with our executor account.
}

func (s *Solver) PostSimulations(simulations []SimulationRequest) error {
	response := SimulationsRequest{
		Json: simulations,
	}
	body, err := json.Marshal(response)
	if err != nil {
		return err
	}
	_, err = utils.MakeHTTPRequest(
		fmt.Sprintf("%s%s", os.Getenv("PLUG_APP_API_URL"), "jobs.simulation.simulated"),
		"POST",
		map[string]string{
			"Content-Type": "application/json",
			"X-API-Key":    os.Getenv("PLUG_APP_API_KEY"),
		},
		nil,
		bytes.NewReader(body),
		SimulationsResponse{},
	)
	if err != nil {
		return err
	}

	return nil
}
