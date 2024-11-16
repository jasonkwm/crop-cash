import ProgressBar from "./ProgressBar";
import { useGlobalState } from "../context/GlobalStateProvider";
import { useNavigate } from "react-router-dom";
import { getAllLoanNfts, getFarmerNftDetails } from "../graphClient/graphClient";
import { useEffect } from "react";

const riceData = {
  cropType: "🍚 Rice",
  tonPerHectare: 4,
  pricePerTon: 269,
};

export default function InvestorDashboard() {
  const { isSwitchOn, setSelectedLoan, investorsData, setInvestorsData } = useGlobalState();
  const nftsDetails = getFarmerNftDetails();
  const allLoans = getAllLoanNfts();
  const navigate = useNavigate();

  useEffect(() => {
    let queriedData = [];
    if (nftsDetails.data && allLoans.data) {
      for (let transfer of (nftsDetails.data as any).landObjectUpdateds) {
        const foundAmount = (allLoans.data as any).loanInitiliazeds.find((w: any) => transfer.tokenId === w.tokenId);
        if (!transfer || !foundAmount) continue;
        const harvestPerYear = Math.floor(Math.random() * 4) + 2;
        queriedData.push({
          tokenId: transfer.tokenId,
          fieldSize: transfer.sizeInHectare,
          cropData: riceData,
          askingLoan: foundAmount.amount,
          avgHarvestPerYear: harvestPerYear,
          funded: 0,
          avgTimeBetweenHarvest: Math.floor(12 / harvestPerYear),
        });
      }
      if (queriedData.length === investorsData.length) return;
      setInvestorsData(queriedData);
    }
  }, [nftsDetails, allLoans]);
  return (
    <div className="max-w-2xl mx-auto mt-8 w-[90%] bg-white p-6 rounded">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Investors Dashboard</h1>
        {isSwitchOn && (
          <a href="/apply-loan" className="text-black hover:text-black">
            <button className="bg-blue-400">Apply Loan</button>
          </a>
        )}
      </div>
      {investorsData.map((fData: any, index: any) => (
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
              <button
                className="bg-green-400 text-black"
                onClick={() => {
                  setSelectedLoan(fData);
                  navigate("/chart");
                }}
              >
                View
              </button>
            </div>
          </div>
          <ProgressBar funded={Number(fData.funded)} total={Number(fData.askingLoan)} />
        </div>
      ))}
    </div>
  );
}
