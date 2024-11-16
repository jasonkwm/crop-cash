import ProgressBar from "./ProgressBar";
import { useGlobalState } from "../context/GlobalStateProvider";
import { getFarmerNftDetails, getFarmerNfts, getLoanInitializeds } from "../graphClient/graphClient";
import { useWeb3Auth } from "../context/Web3AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

// type FarmerLand = {
//   tokenId: number;
//   size: number;
//   amount: number;
// };

const riceData = {
  cropType: "🍚 Rice",
  tonPerHectare: 4,
  pricePerTon: 269,
};

export default function FarmerDashboard() {
  const { smartWalletAddress } = useWeb3Auth();
  const farmerNfts = getFarmerNfts(smartWalletAddress);
  const nftsDetails = getFarmerNftDetails();
  const loanInitialized = getLoanInitializeds(smartWalletAddress);
  const { farmersData, setFarmersData, kycDone, handleOpenModal, setKycDone } = useGlobalState();
  const navigate = useNavigate();

  useEffect(() => {
    let farmerLands = [];
    if (farmerNfts.data && nftsDetails.data && loanInitialized.data) {
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
          fieldSize: foundDetails.sizeInHectare,
          cropData: riceData,
          askingLoan: foundAmount.amount,
          avgHarvestPerYear: 2,
          funded: 0,
          avgTimeBetweenHarvest: 6,
        });
      }
      if (farmerLands.length > 0) setKycDone(true);
      if (farmerLands.length === farmersData.length) return;

      setFarmersData(farmerLands);
    }
  }, [farmerNfts, nftsDetails, loanInitialized]);

  return (
    <div className="max-w-2xl mx-auto mt-8 w-[90%] bg-white p-6 rounded">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Farmers Dashboard</h1>

        {kycDone ? (
          <button
            className="bg-blue-400 hover:bg-blue-500 transition-all flex justify-center items-center gap-2"
            onClick={() => navigate("/apply-loan")}
          >
            <img src="/blue-med-saturated320px.png" width={40} height={40} />
            <span>Apply Loan</span>
          </button>
        ) : (
          <button
            className="bg-ourGreen hover:bg-ourGreenDark text-black  flex justify-center items-center gap-2"
            onClick={handleOpenModal}
          >
            <img src="yellow-saturated1600px.png" width={40} height={40} />
            <span>KYC to apply loan</span>
          </button>
        )}
      </div>
      {farmersData.map((fData: any, index: any) => (
        <div key={index} className="bg-[#F8F8F8] shadow-md rounded-md p-4 mb-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Crop: {fData.cropData.cropType}</h3>
              <p className="text-gray-600">
                <strong>Field Size:</strong> {fData.fieldSize} hectares
              </p>
              <p className="text-gray-600">
                <strong>Tons per Hectare:</strong> {fData.cropData.tonPerHectare} tons
              </p>
              <p className="text-gray-600">
                <strong>Market Price per Ton:</strong> ${fData.cropData.pricePerTon}
              </p>
              <p className="text-gray-600">
                <strong>Total Revenue:</strong> ${fData.askingLoan}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-ourYellow text-black flex justify-center items-center gap-2">
                <img src="/red800px.png" width={40} height={40} />
                <span>Repay</span>
              </button>
              <button className="bg-ourGreen hover:bg-ourGreenDark text-black flex gap-2 justify-center items-center">
                <img src="/frog-green800px.png" width={40} height={40} />
                <span>View</span>
              </button>
            </div>
          </div>
          <ProgressBar funded={Number(fData.funded)} total={Number(fData.askingLoan)} />
        </div>
      ))}
    </div>
  );
}
