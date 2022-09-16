package main

import (
    "fmt"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
	"encoding/json"
	"bytes"
	"strconv"
	"time"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	pb "github.com/hyperledger/fabric-protos-go/peer"
  )
  
  // SmartContract provides functions for managing an Asset
	 type SmartContract struct {
	 contractapi.Contract
	 }

	 // Asset describes basic details of what makes up a simple asset
	 type HousingTitle struct {
		ID             string `json:"ID"`
		IdentityNumber string `json:"identityNumber"`
		OwnerName      string `json:"ownerName"`
		FullAddress	   string `json:"fullAddress"`
		State          string `json:"state"`
		HashValue      string `json:"hashValue"`
		Date           string `json:"date"`
		FileName	   string `json:"fileName"`
	   }

	// InitLedger adds a base set of assets to the ledger
	func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
		housingTitles := []HousingTitle{
		{ID: "asset1", IdentityNumber: "300", OwnerName: "Lee", FullAddress: "14, Bk4/2", State: "Selangor", HashValue: "blue", Date: "5", FileName: "aaa"},
		{ID: "asset2", IdentityNumber: "300", OwnerName: "Lee", FullAddress: "14, Bk4/2", State: "Selangor", HashValue: "blue", Date: "5", FileName: "aaa"},
		{ID: "asset3", IdentityNumber: "300", OwnerName: "Lee", FullAddress: "14, Bk4/2", State: "Selangor", HashValue: "blue", Date: "5", FileName: "aaa"},
		}

		for _, housingTitles := range housingTitles {
			housingTitleJSON, err := json.Marshal(housingTitles)
			if err != nil {
			return err
			}

			err = ctx.GetStub().PutState(housingTitles.ID, housingTitleJSON)
			if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
			}
		}

		return nil
		}

	// CreateAsset issues a new asset to the world state with given details.
	func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, id string, identityNumber string, ownerName string, fullAddress string, state string, hashValue string, date string, fileName string) error {
		exists, err := s.AssetExists(ctx, id)
		if err != nil {
		  return err
		}
		if exists {
		  return fmt.Errorf("the asset %s already exists", id)
		}
	
		housingTitle := HousingTitle{
		  ID:             id,
		  IdentityNumber: identityNumber,
		  OwnerName:      ownerName,
		  FullAddress:    fullAddress,
		  State: 		  state,
		  HashValue:	  hashValue,
		  Date: 		  date,
		  FileName:	      fileName,
		}
		housingTitleJSON, err := json.Marshal(housingTitle)
		if err != nil {
		  return err
		}
	
		return ctx.GetStub().PutState(id, housingTitleJSON)
	  }

	// DeleteAsset deletes an given asset from the world state.
	func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, id string) error {
		exists, err := s.AssetExists(ctx, id)
		if err != nil {
		  return err
		}
		if !exists {
		  return fmt.Errorf("the asset %s does not exist", id)
		}
  
		return ctx.GetStub().DelState(id)
	 }

	// AssetExists returns true when asset with given ID exists in world state
	func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
		assetJSON, err := ctx.GetStub().GetState(id)
		if err != nil {
		  return false, fmt.Errorf("failed to read from world state: %v", err)
		}
  
		return assetJSON != nil, nil
	  }

	

	// GetAllAssets returns all assets found in world state
	func (s *SmartContract) GetAllAssets(ctx contractapi.TransactionContextInterface) ([]*HousingTitle, error) {
		// range query with empty string for startKey and endKey does an
		// open-ended query of all assets in the chaincode namespace.
			resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
			if err != nil {
			  return nil, err
			}
			defer resultsIterator.Close()
		
			var housingTitles []*HousingTitle
			for resultsIterator.HasNext() {
			  queryResponse, err := resultsIterator.Next()
			  if err != nil {
				return nil, err
			  }
		
			  var housingTitle HousingTitle
			  err = json.Unmarshal(queryResponse.Value, &housingTitle)
			  if err != nil {
				return nil, err
			  }
			  housingTitles = append(housingTitles, &housingTitle)
			}
		
			return housingTitles, nil
		  }

	
	// return history of an asset
	func (s *SmartContract) getHistoryForAsset(stub shim.ChaincodeStubInterface, args []string) pb.Response {

		if len(args) < 1 {
			return shim.Error("Incorrect number of arguments. Expecting 1")
		}
	
		assetName := args[0]
	
		fmt.Printf("- start getHistoryForAsset: %s\n", assetName)
	
		resultsIterator, err := stub.GetHistoryForKey(assetName)
		if err != nil {
			return shim.Error(err.Error())
		}
		defer resultsIterator.Close()
	
		// buffer is a JSON array containing historic values for the marble
		var buffer bytes.Buffer
		buffer.WriteString("[")
	
		bArrayMemberAlreadyWritten := false
		for resultsIterator.HasNext() {
			response, err := resultsIterator.Next()
			if err != nil {
				return shim.Error(err.Error())
			}
			// Add a comma before array members, suppress it for the first array member
			if bArrayMemberAlreadyWritten == true {
				buffer.WriteString(",")
			}
			buffer.WriteString("{\"TxId\":")
			buffer.WriteString("\"")
			buffer.WriteString(response.TxId)
			buffer.WriteString("\"")
	
			buffer.WriteString(", \"Value\":")
			// if it was a delete operation on given key, then we need to set the
			//corresponding value null. Else, we will write the response.Value
			//as-is (as the Value itself a JSON marble)
			if response.IsDelete {
				buffer.WriteString("null")
			} else {
				buffer.WriteString(string(response.Value))
			}
	
			buffer.WriteString(", \"Timestamp\":")
			buffer.WriteString("\"")
			buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
			buffer.WriteString("\"")
	
			buffer.WriteString(", \"IsDelete\":")
			buffer.WriteString("\"")
			buffer.WriteString(strconv.FormatBool(response.IsDelete))
			buffer.WriteString("\"")
	
			buffer.WriteString("}")
			bArrayMemberAlreadyWritten = true
		}
		buffer.WriteString("]")
	
		fmt.Printf("- getHistoryForAsset returning:\n%s\n", buffer.String())
	
		return shim.Success(buffer.Bytes())
	}

	// ReadAsset returns the asset stored in the world state with given id.
	func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*HousingTitle, error) {
		housingTitleJSON, err := ctx.GetStub().GetState(id)
		if err != nil {
		  return nil, fmt.Errorf("failed to read from world state: %v", err)
		}
		if housingTitleJSON == nil {
		  return nil, fmt.Errorf("the asset %s does not exist", id)
		}
	
		var housingTitle HousingTitle
		err = json.Unmarshal(housingTitleJSON, &housingTitle)
		if err != nil {
		  return nil, err
		}
	
		return &housingTitle, nil
	  }

	// UpdateAsset updates an existing asset in the world state with provided parameters.
	func (s *SmartContract) UpdateAsset(ctx contractapi.TransactionContextInterface, id string, identityNumber string, ownerName string, fullAddress string, state string, hashValue string, date string, fileName string) error {
		exists, err := s.AssetExists(ctx, id)
		if err != nil {
		  return err
		}
		if !exists {
		  return fmt.Errorf("the asset %s does not exist", id)
		}
  
		// overwriting original asset with new asset
		housingTitle := HousingTitle{
			ID:             id,
			IdentityNumber: identityNumber,
			OwnerName:      ownerName,
			FullAddress:    fullAddress,
			State: 			state,
			HashValue:		hashValue,
			Date: 			date,
			FileName:		fileName,
		}
		housingTitleJSON, err := json.Marshal(housingTitle)
		if err != nil {
		  return err
		}
  
		return ctx.GetStub().PutState(id, housingTitleJSON)
	}

	// TransferAsset updates the owner field of asset with given id in world state.
	func (s *SmartContract) TransferAsset(ctx contractapi.TransactionContextInterface, id string, newOwner string) error {
		housingTitle, err := s.ReadAsset(ctx, id)
		if err != nil {
		  return err
		}
  
		housingTitle.OwnerName = newOwner
		housingTitleJSON, err := json.Marshal(housingTitle)
		if err != nil {
		  return err
		}
  
		return ctx.GetStub().PutState(id, housingTitleJSON)
	  }