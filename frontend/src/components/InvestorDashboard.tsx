import ProgressBar from "./ProgressBar";
import { useGlobalState } from "../context/GlobalStateProvider";
import { useNavigate } from "react-router-dom";
import { getAllLoanNfts, getFarmerNftDetails } from "../graphClient/graphClient";
import { useEffect } from "react";
import { createPublicClient, http } from "viem";
import { scrollSepolia } from "viem/chains";
import { CropCashFundABI } from "../abis/CropCashFund";

const riceData = {
  cropType: "🍚 Rice",
  tonPerHectare: 4,
  pricePerTon: 269,
};

const publicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
});

export default function InvestorDashboard() {
  const { setSelectedLoan, investorsData, setInvestorsData } = useGlobalState();
  const nftsDetails = getFarmerNftDetails();
  const allLoans = getAllLoanNfts();
  const navigate = useNavigate();

  useEffect(() => {
    let queriedData = [];
    const queryData = async () => {
      if (nftsDetails.data && allLoans.data) {
        for (let transfer of (nftsDetails.data as any).landObjectUpdateds) {
          const foundAmount = ((allLoans.data as any).loanInitiliazeds as any[])
            .reverse()
            .find((w: any) => transfer.tokenId === w.tokenId);
          if (!transfer || !foundAmount) continue;
          const [totalFunded, _] = await publicClient.readContract({
            address: import.meta.env.VITE_CROP_CASH_FUND,
            abi: CropCashFundABI,
            functionName: "loanRequests",
            args: [BigInt(transfer.tokenId)],
          });
          queriedData.push({
            tokenId: transfer.tokenId,
            fieldSize: transfer.sizeInHectare,
            cropData: riceData,
            askingLoan: foundAmount.amount,
            avgHarvestPerYear: 2,
            funded: Number(totalFunded),
            avgTimeBetweenHarvest: 6,
          });
        }
        if (queriedData.length === investorsData.length) return;
        setInvestorsData(queriedData);
      }
    };
    queryData();
  }, [nftsDetails, allLoans]);

  console.log(investorsData);

  return (
    <div className="max-w-2xl mx-auto mt-8 w-[90%] bg-white p-6 rounded">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Loan Applications</h1>
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
                className="bg-ourGreen hover:bg-ourGreenDark text-black flex gap-2 justify-center items-center"
                onClick={() => {
                  setSelectedLoan(fData);
                  navigate("/chart");
                }}
              >
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
