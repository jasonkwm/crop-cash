// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@chainlink/contracts@1.2.0/src/v0.8/operatorforwarder/Operator.sol";

contract CropCashOracle is Operator {
    constructor (address link, address owner) Operator(link, owner) {}
}