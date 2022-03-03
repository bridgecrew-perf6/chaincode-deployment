package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SampleContract provides functions for managing a asset
type SampleContract struct {
	contractapi.Contract
}

// asset describes basic details of what makes up a asset
type asset struct {
	Make   string `json:"make"`
	Model  string `json:"model"`
	Colour string `json:"colour"`
	Owner  string `json:"owner"`
}

// QueryResult structure used for handling result of query
type QueryResult struct {
	Key    string `json:"Key"`
	Record *asset
}

// InitLedger adds a base set of assets to the ledger
func (s *SampleContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	assets := []asset{
		asset{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko"},
		asset{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad"},
		asset{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo"},
		asset{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max"},
		asset{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana"},
	}

	for i, asset := range assets {
		assetAsBytes, _ := json.Marshal(asset)
		err := ctx.GetStub().PutState("asset"+strconv.Itoa(i), assetAsBytes)

		if err != nil {
			return fmt.Errorf("Failed to put to world state. %s", err.Error())
		}
	}

	return nil
}

// Createasset adds a new asset to the world state with given details
func (s *SampleContract) Createasset(ctx contractapi.TransactionContextInterface, assetNumber string, make string, model string, colour string, owner string) error {
	asset := asset{
		Make:   make,
		Model:  model,
		Colour: colour,
		Owner:  owner,
	}

	assetAsBytes, _ := json.Marshal(asset)

	return ctx.GetStub().PutState(assetNumber, assetAsBytes)
}

// Queryasset returns the asset stored in the world state with given id
func (s *SampleContract) Queryasset(ctx contractapi.TransactionContextInterface, assetNumber string) (*asset, error) {
	assetAsBytes, err := ctx.GetStub().GetState(assetNumber)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if assetAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", assetNumber)
	}

	asset := new(asset)
	_ = json.Unmarshal(assetAsBytes, asset)

	return asset, nil
}

// QueryAllassets returns all assets found in world state
func (s *SampleContract) QueryAllassets(ctx contractapi.TransactionContextInterface) ([]QueryResult, error) {
	startKey := ""
	endKey := ""

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		asset := new(asset)
		_ = json.Unmarshal(queryResponse.Value, asset)

		queryResult := QueryResult{Key: queryResponse.Key, Record: asset}
		results = append(results, queryResult)
	}

	return results, nil
}

// ChangeassetOwner updates the owner field of asset with given id in world state
func (s *SampleContract) ChangeassetOwner(ctx contractapi.TransactionContextInterface, assetNumber string, newOwner string) error {
	asset, err := s.Queryasset(ctx, assetNumber)

	if err != nil {
		return err
	}

	asset.Owner = newOwner

	assetAsBytes, _ := json.Marshal(asset)

	return ctx.GetStub().PutState(assetNumber, assetAsBytes)
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SampleContract))

	if err != nil {
		fmt.Printf("Error create asset chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting asset chaincode: %s", err.Error())
	}
}
