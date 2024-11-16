// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CropCashLandNFT is ERC721, Ownable {

    constructor(address initialOwner)
        ERC721("CropCashLand", "CCL")
        Ownable(initialOwner) {}

    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
    
}