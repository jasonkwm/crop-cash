// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}

interface ICropCashConsumer {
    function tokenIdToLoanAmount(uint256 tokenId) external view returns (uint256);
}

interface ICropCashLandNFT {
    function ownerOf(uint256 tokenId) external view returns (address); 
}

contract CropCashFund {
    struct LoanRequest {
        uint256 totalFunded;
        bool isWithdrawn;
        mapping(address => uint256) contributions;
    }

    IERC20 public cropCashUSDC; // Reference to the USDC token contract
    ICropCashConsumer public cropCashConsumer;
    ICropCashLandNFT public cropCashLandNFT;
    uint256 public projectCount;
    mapping(uint256 => LoanRequest) public loanRequests;

    event ProjectCreated(
        uint256 projectId,
        string title,
        string landSize,
        address indexed farmer,
        uint256 fundingGoal
    );

    event Funded(
        uint256 indexed tokenId,
        address indexed investor,
        uint256 amount
    );

    event Withdrawn(
        uint256 projectId,
        address indexed farmer,
        uint256 amount
    );

    constructor(address _usdcAddress, address _cropCashConsumerAddress, address _cropCashLandNFTAddress) {
        cropCashUSDC = IERC20(_usdcAddress);
        cropCashConsumer = ICropCashConsumer(_cropCashConsumerAddress);
        cropCashLandNFT = ICropCashLandNFT(_cropCashLandNFTAddress);
    }

    // Fund a specific project with USDC
    function fundProject(uint256 _tokenId, uint256 _amount) public {
        uint256 maxAmount = cropCashConsumer.tokenIdToLoanAmount(_tokenId);
        uint256 amountAfterFunded = loanRequests[_tokenId].totalFunded + _amount;

        require(maxAmount > 0, "Token Id is not initilized for loan");
        require(_amount > 0, "Funding amount must be greater than zero");
        require(amountAfterFunded <= maxAmount, "Exceed max amount");
        require(!loanRequests[_tokenId].isWithdrawn, "Loan has been closed due to withdrawn");

        // Transfer USDC from investor to this contract
        bool success = cropCashUSDC.transferFrom(msg.sender, address(this), _amount);
        require(success, "USDC transfer failed");

        loanRequests[_tokenId].totalFunded = amountAfterFunded;
        loanRequests[_tokenId].contributions[msg.sender] += _amount;

        emit Funded(_tokenId, msg.sender, _amount);
    }

    // Withdraw funds (only farmer)
    function withdrawFunds(uint256 _tokenId) public {
        require(!loanRequests[_tokenId].isWithdrawn, "Funds already withdrawn");
        require(loanRequests[_tokenId].totalFunded > 0, "Loan Request is not even funded");
        address ownerOfTokenId = cropCashLandNFT.ownerOf(_tokenId);
        require(ownerOfTokenId == msg.sender, "You are not owner of this token id");


        loanRequests[_tokenId].isWithdrawn = true;
        uint256 amount = loanRequests[_tokenId].totalFunded;

        // Transfer USDC from contract to farmer
        bool success = cropCashUSDC.transferFrom(address(this), msg.sender, amount);
        require(success, "USDC withdrawal failed");

        emit Withdrawn(_tokenId, msg.sender, amount);
    }
}