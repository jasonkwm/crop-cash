// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Chainlink, ChainlinkClient} from "@chainlink/contracts@1.2.0/src/v0.8/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts@1.2.0/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts@1.2.0/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract CropCashConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    struct CropCashLandObject {
        string coordinate1;
        string coordinate2;
        string coordinate3;
        string coordinate4;
        uint256 sizeInHectare;
    }

    uint256 private constant ORACLE_PAYMENT = (1 * LINK_DIVISIBILITY) / 10; // 0.1 * 10**18
    uint256 public oneTonPrice;
    uint256 public tonPerHectare;
    mapping(uint256 => CropCashLandObject) public tokenIdToLandObject;
    mapping(uint256 => uint256) public tokenIdToLoanAmount;

    event RequestOneTonPriceFulfilled(
        bytes32 indexed requestId,
        uint256 indexed price
    );

    event RequestTonPerHectareFulfilled(
        bytes32 indexed requestId,
        uint256 indexed ton
    );

    event LandObjectUpdated (
        uint256 indexed tokenId,
        string coordinate1,
        string coordinate2,
        string coordinate3,
        string coordinate4,
        uint256 sizeInHectare
    );

    event OneTonPriceRequested (bool requested);
    event TonPerHectareRequested (bool requested);

    event LoanInitiliazed (address indexed landOwner, uint256 tokenId, uint256 amount);

    /**
     *  Sepolia
     *@dev LINK address in Sepolia network: 0x779877A7B0D9E8603169DdbD7836e478b4624789
     * @dev Check https://docs.chain.link/docs/link-token-contracts/ for LINK address for the right network
     */
    constructor() ConfirmedOwner(msg.sender) {
        _setChainlinkToken(0x231d45b53C905c3d6201318156BDC725c9c3B9B1);
    }

    function requestOneTonPrice(
        address _oracle,
        string memory _jobId
    ) public {
        emit OneTonPriceRequested(true);
        Chainlink.Request memory req = _buildChainlinkRequest(
            stringToBytes32(_jobId),
            address(this),
            this.fulfillOneTonPrice.selector
        );
        req._add(
            "get",
            "https://lobster-smashing-wren.ngrok-free.app/onetonprice"
        );
        req._add("path", "USD");
        req._addInt("times", 1);
        _sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function requestTonPerHectare(
        address _oracle,
        string memory _jobId
    ) public {
        emit TonPerHectareRequested(true);
        Chainlink.Request memory req = _buildChainlinkRequest(
            stringToBytes32(_jobId),
            address(this),
            this.fulfillTonPerHectare.selector
        );
        req._add(
            "get",
            "https://lobster-smashing-wren.ngrok-free.app/tonperhectare"
        );
        req._add("path", "TON");
        req._addInt("times", 1);
        _sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function updateLandObject(
        uint256 tokenId, 
        string calldata coordinate1, 
        string calldata coordinate2, 
        string calldata coordinate3,
        string calldata coordinate4,
        uint256 sizeInHectare
    ) public {
        CropCashLandObject memory newLandObject = CropCashLandObject({
            coordinate1: coordinate1,
            coordinate2: coordinate2,
            coordinate3: coordinate3,
            coordinate4: coordinate4,
            sizeInHectare: sizeInHectare
        });
        tokenIdToLandObject[tokenId] = newLandObject;
        emit LandObjectUpdated(tokenId, coordinate1, coordinate2, coordinate3, coordinate4, sizeInHectare);
    }

    function fulfillOneTonPrice(
        bytes32 _requestId,
        uint256 _price
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestOneTonPriceFulfilled(_requestId, _price);
        oneTonPrice = _price;
    }

    function fulfillTonPerHectare(
        bytes32 _requestId,
        uint256 _ton
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestTonPerHectareFulfilled(_requestId, _ton);
        tonPerHectare = _ton;
    }

    function calculateCeilingAmount(uint256 tokenId) public view returns (uint256) {
        require(tokenIdToLandObject[tokenId].sizeInHectare > 0, "Invalid tokenId");
        // sizeInHEctare
        // OneTonPrice
        // Ton per hectare
        return tokenIdToLandObject[tokenId].sizeInHectare * tonPerHectare * oneTonPrice;
    }

    function initializeLoan(uint256 tokenId, uint256 amount) public {
        tokenIdToLoanAmount[tokenId] = amount;
        emit LoanInitiliazed(msg.sender, tokenId, amount);
    }

    function getChainlinkToken() public view returns (address) {
        return _chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        _cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function stringToBytes32(
        string memory source
    ) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}