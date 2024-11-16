import ProgressBar from "./ProgressBar";
import { useGlobalState } from "../context/GlobalStateProvider";
import { useEffect } from "react";
import { getFarmerNftDetails, getFarmerNfts, getLoanInitializeds } from "../graphClient/graphClient";
import { useWeb3Auth } from "../context/Web3AuthProvider";

// const farmersCrop = [
//   {
//     id: 1,
//     cropData: cropData[0],
//     fieldSize: 10.3,
//     funded: 5620,
//     askingLoan: 10.3 * (cropData[0].tonPerHectare * cropData[0].pricePerTon),
//     avgHarvestPerYear: 2,
//     avgTimeBetweenHarvest: 6, // In months
//     estFullGrownDate: "", // String
//   },
//   {
//     id: 2,
//     cropData: cropData[1],
//     fieldSize: 8.1,
//     funded: 23000,
//     askingLoan: 8.1 * (cropData[1].tonPerHectare * cropData[1].pricePerTon),
//     avgHarvestPerYear: 2,
//     avgTimeBetweenHarvest: 6, // In months
//     estFullGrownDate: "", // String
//   },
// ];

type FarmerLand = {
  tokenId: number;
  size: number;
  amount: number;
};

export default function FarmerDashboard() {
  const { smartWalletAddress } = useWeb3Auth();
  const farmerNfts = getFarmerNfts(smartWalletAddress);
  const nftsDetails = getFarmerNftDetails();
  const loanInitialized = getLoanInitializeds(smartWalletAddress);

  let farmerLands: FarmerLand[] = [];
  if (farmerNfts.data && nftsDetails.data) {
    for (let transfer of (farmerNfts.data as any).transfers) {
      const foundDetails = (nftsDetails.data as any).landObjectUpdateds.find(
        (w: any) => transfer.tokenId === w.tokenId
      );
      const foundAmount = (loanInitialized.data as any).loanInitiliazeds.find(
        (w: any) => transfer.tokenId === w.tokenId
      );
      if (!foundDetails || !foundAmount) continue;
      farmerLands.push({
        tokenId: foundDetails.tokenId,
        size: foundDetails.sizeInHectare,
        amount: foundAmount.amount,
      });
    }
  }

  console.log("landswithsize", farmerLands);

  const { farmersData } = useGlobalState();
  return (
    <div className="max-w-2xl mx-auto mt-8 w-[90%] bg-white p-6 rounded">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Farmers Dashboard</h1>
        <a href="/apply-loan" className="text-black hover:text-black">
          <button className="bg-blue-400">Apply Loan</button>
        </a>
      </div>
      {farmersData.map((fData: any, index: any) => (
        <div key={index} className="bg-[#F8F8F8] shadow-md rounded-md p-4 mb-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Crop: {fData.cropData.cropType}</h3>
              <p className="text-gray-600">
                <strong>Field Size:</strong> {fData.fieldSize.toFixed(2)} hectares
              </p>
              <p className="text-gray-600">
                <strong>Tons per Hectare:</strong> {fData.cropData.tonPerHectare} tons
              </p>
              <p className="text-gray-600">
                <strong>Market Price per Ton:</strong> ${fData.cropData.pricePerTon}
              </p>
              <p className="text-gray-600">
                <strong>Total Revenue:</strong> ${fData.askingLoan.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-ourYellow TEXT-WH">Repay</button>
              <button className="bg-green-400">Claim</button>
            </div>
          </div>
          <ProgressBar funded={fData.funded} total={fData.askingLoan} />
        </div>
      ))}
    </div>
  );
}
