# CROP CASH

Deployed version: [CropCash](https://crop-cash.vercel.app/)

## Contract Deployed:

### CropCashOracle

-   **Address**: 0x4466B04eb45b3BDba1EF11036f5fb575dFe4bFFa
-   **Link**: [scrollscan](https://sepolia.scrollscan.com/address/0x4466B04eb45b3BDba1EF11036f5fb575dFe4bFFa)

### CropCashConsumer

-   **Address**: 0xC126DB3B0B81aDbF352F2a66D6ceE7Cc0C1AC9BA
-   **Link**: [scrollscan](https://sepolia.scrollscan.com/address/0xC126DB3B0B81aDbF352F2a66D6ceE7Cc0C1AC9BA#code)

### CropCashLandNFT

-   **Address**: 0xB626B365f5EF1691B26227B3A8C0Ee24361c0A17
-   **Link**: [scrollscan](https://sepolia.scrollscan.com/address/0xB626B365f5EF1691B26227B3A8C0Ee24361c0A17)

### CropCashUSDC

-   **Address**: 0xE10cEd24353325fD5C8dc5EFEbb25CAA0Ae564C2
-   **Link**: [scrollscan](https://sepolia.scrollscan.com/address/0xE10cEd24353325fD5C8dc5EFEbb25CAA0Ae564C2#code)

### CropCashFund

-   **Address**: 0xDBfb6CF2836Fa0c84F9a6741697EeEbe10Cd9726
-   **Link**: [scrollscan](https://sepolia.scrollscan.com/address/0xDBfb6CF2836Fa0c84F9a6741697EeEbe10Cd9726#code)

### CropCash Schema Hook

-   **Address**: 0x8A2C0ECf306878a6BE5968c0188D4B1Fe23Da7a2
-   **Link**: [scrollscan](https://sepolia.scrollscan.com/address/0x8A2C0ECf306878a6BE5968c0188D4B1Fe23Da7a2)

**CropCash** is designed to bridge the financial gap for hardworking farmers who face challenges securing loans before their crops are harvested. We combine technology and community support to ensure farmers get the financial backing they need when they need it most.

By leveraging satellite data to analyze harvest cycles, estimate potential yields, and assess a farmer’s consistency. Based on this data, farmers can apply for loans proportional to the expected value of their crops.

What makes **CropCash** unique is its open funding model. Anyone—from individuals contributing small amounts to governments supporting local agriculture—can fund these loans. This inclusive approach not only helps farmers thrive but also strengthens the agricultural backbone of entire communities.

By supporting **CropCash**, you're not just providing loans; you're investing in the prosperity of farmers and the future of food security.

## Key Features

-   **Seamless Onboarding**: By leveraging Account Abstraction(ERC-4337), users will not even release they are using a Web3 Application.
-   **No Barrier investment**: Anyone—from individuals contributing small amounts to governments can fund these loans.

## How it works

### Web3Auth/Biconomy

We needed to abstract the web3 part from the farmer, so we used web3auth and biconomy to pay the user's gas fees and make a seamless user experience. After onboarding, the farmer can make loan request, by selecting the farm on the map.

## Sign Protocol

Sign Protocol is used to Attest our farmers land and legitimacy. Once our partnered 3rd party or goverment has attested the farmer and it's land we will then mint an NFT for that plot of land which will be linked to the attestation.

Schema hook has been used for nft minting to land owner as a proof of ownership, and requesting our own custom chainlink oracle for realtime crop prices.

## Scroll

We picked Scroll to deploy our smart contracts for several reasons, one of them being the possibility of accounts abstraction and the support of the graph, along with its cheap gas fees. In the future, we will also implement zero-knowledge proofs for the farm locations using scroll.

## Satellite Imagery (Chainlink)

We then use Google Earth Engine to pull historic NDVI (normalized difference vegetation index) data from the satellite, on the farmer's field, it can also be called the "green" index, it will tell us how green the farm was at a point in time. Using this information we can find out when the farmer usually harvests the crops.

## Crop Estimation (Chainlink)

Based on the size of the farm, the kind of crop the farmer is growing, and the market rate for the crop, we can generate the maximum loan amount that the farmer can borrow. We use chainlink to help us fetch off-chain data onto our smart contract. This also ensures that users are able to verify that the data we are getting is from a reputable source.

# Circle

We use USDC as the main source of funding the farmer, to ensure a stable monetary value.
The investors are able to fund the farmers up to their asked amount.
The farmer is able to withdraw the raised loan and use it for their expenses until the harvest is done.
After which, the farmer can onramp fiat back onto our platform and repay their loans!

# TheGraph

The farmer then applies for the loan, which is essentially, minting an nft, but they will never know it. We use the graph in order to index all the events on our smart contracts and find the farmers' existing and past loans.

## Installation Guide

We mainly use yarn instead of npm due to it's reliability in solving dependencies.

```
cd frontend && yarn && yarn dev
```
