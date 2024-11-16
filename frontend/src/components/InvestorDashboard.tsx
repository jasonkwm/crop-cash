import ProgressBar from "./ProgressBar";
import { useGlobalState } from "../context/GlobalStateProvider";
import { useNavigate } from "react-router-dom";

export default function InvestorDashboard() {
  const { isSwitchOn, farmersData, setSelectedLoan } = useGlobalState();
  const navigate = useNavigate();
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
              <button
                className="bg-green-400"
                onClick={() => {
                  setSelectedLoan(index);
                  navigate("/chart");
                }}
              >
                View
              </button>
            </div>
          </div>
          <ProgressBar funded={fData.funded} total={fData.askingLoan} />
        </div>
      ))}
    </div>
  );
}
