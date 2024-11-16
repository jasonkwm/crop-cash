import React from "react";

interface FarmItemProps {
  cropType: string;
  fieldSize: number;
  tonPerHectare: number;
  pricePerTon: number;
  funded: number;
}

const FarmItem: React.FC<FarmItemProps> = ({ cropType, fieldSize, tonPerHectare, pricePerTon, funded }) => {
  // Calculate total revenue
  const totalRevenue = fieldSize * tonPerHectare * pricePerTon;

  // Progress bar percentage
  const progressPercentage = Math.min((funded / totalRevenue) * 100, 100);

  return (
    <div className="bg-[#F8F8F8] shadow-md rounded-md p-4 mb-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Crop: {cropType}</h3>
          <p className="text-gray-600">
            <strong>Field Size:</strong> {fieldSize.toFixed(2)} hectares
          </p>
          <p className="text-gray-600">
            <strong>Tons per Hectare:</strong> {tonPerHectare} tons
          </p>
          <p className="text-gray-600">
            <strong>Market Price per Ton:</strong> ${pricePerTon}
          </p>
          <p className="text-gray-600">
            <strong>Total Revenue:</strong> ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="bg-ourYellow TEXT-WH">Repay</button>
          <button className="bg-green-400">Claim</button>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-1">
          Loan Progress: ${funded.toLocaleString()} / ${totalRevenue.toLocaleString()}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const farmersCrop = [
  {
    cropType: "🍚 Rice",
    tonPerHectare: 4,
    pricePerTon: 269,
    fieldSize: 10.3,
    funded: 5620,
  },
  {
    cropType: "🍌 Banana",
    tonPerHectare: 25,
    pricePerTon: 700,
    fieldSize: 8.1,
    funded: 23000,
  },
];

export default function FarmerDashboard() {
  return (
    <div className="max-w-2xl mx-auto mt-8 w-[90%] bg-white p-6 rounded">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Farmers Dashboard</h1>
        <a href="/apply-loan" className="text-black hover:text-black">
          <button className="bg-blue-400">Apply Loan</button>
        </a>
      </div>
      {farmersCrop.map((crop, index) => (
        <FarmItem key={index} {...crop} />
      ))}
    </div>
  );
}
