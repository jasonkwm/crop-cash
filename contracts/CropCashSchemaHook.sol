// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { ISPHook } from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";

interface ICropCashLandNFT {
    function safeMint(address to, uint256 tokenId) external;
}

interface ICropCashConsumer {
    function requestOneTonPrice(address _oracle, string memory _jobId) external;
    function requestTonPerHectare(address _oracle, string memory _jobId) external;
    function updateLandObject(uint256 tokenId, string calldata coordinate1, string calldata coordinate2, string calldata coordinate3, string calldata coordinate4, uint256 sizeInHectare) external ;
}

// @dev This contract implements the actual schema hook.
contract CropCashSchemaHook is ISPHook {

    ICropCashLandNFT private cropCashLandNFT;
    ICropCashConsumer private cropCashConsumer;
    address private cropCashOracleAddress;

    event DidReceiveAttestation(
        address indexed attester,
        address indexed recipient,
        string coordinate1,
        string coordinate2,
        string coordinate3,
        string coordinate4,
        uint256 sizeInHectare
    );

    event RequestedOneTonPrice(bool requested);
    event RequestedTonPerHectare(bool requested);

    constructor(address _cropCashLandNFTAddress, address _cropCashConsumerAddress, address _cropCashOracleAddress) {
        cropCashLandNFT = ICropCashLandNFT(_cropCashLandNFTAddress);
        cropCashConsumer = ICropCashConsumer(_cropCashConsumerAddress);
        cropCashOracleAddress = _cropCashOracleAddress;
    } 

    function didReceiveAttestation(
        address attester, // attester
        uint64, // schemaId
        uint64 attestationId, // attestationId
        bytes calldata data // extraData
    )
        external
        payable
    {
        (
            address recipient, 
            string memory coordinate1, 
            string memory coordinate2,
            string memory coordinate3,
            string memory coordinate4,
            uint256 sizeInHectare
        ) = abi.decode(data, (address, string, string, string, string, uint256));

        emit DidReceiveAttestation(attester, recipient, coordinate1, coordinate2, coordinate3, coordinate4, sizeInHectare);

        // Request for latest data
        cropCashConsumer.requestOneTonPrice(cropCashOracleAddress, "94edad063b1a439ebe62928a3fc99e99");
        emit RequestedOneTonPrice(true);

        cropCashConsumer.requestTonPerHectare(cropCashOracleAddress, "098624b8d362463a93a9f4cbb2b5d375");
        emit RequestedTonPerHectare(true);

        // Update data for tokenId in consumer
        cropCashConsumer.updateLandObject(attestationId, coordinate1, coordinate2, coordinate3, coordinate4, sizeInHectare);

        // Mint NFT to farmer
        cropCashLandNFT.safeMint(recipient, attestationId);
    }

    function didReceiveAttestation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        view
    {
        // To be implemented
    }

    function didReceiveRevocation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        bytes calldata // extraData
    )
        external
        payable
    {
        // To be implemented
    }

    function didReceiveRevocation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        view
    {
        // To be implemented
    }
}