import { createContext, useContext, useState } from "react";

// type GlobalProviderType = {
//   employee: any;
//   setEmployee: (value: any) => void;
// };

export const cropData = [
  {
    cropType: "🍚 Rice",
    tonPerHectare: 4,
    pricePerTon: 269,
  },
  {
    cropType: "🍌 Banana",
    tonPerHectare: 25,
    pricePerTon: 700,
  },
];

// const farmersCrop = [
//   {
//     tokenId: 1,
//     cropData: cropData[0],
//     fieldSize: 10.3,
//     funded: 5620,
//     askingLoan: 10.3 * (cropData[0].tonPerHectare * cropData[0].pricePerTon),
//     avgHarvestPerYear: 2,
//     avgTimeBetweenHarvest: 6, // In months
//     estFullGrownDate: "", // String
//   },
//   {
//     tokenId: 2,
//     cropData: cropData[1],
//     fieldSize: 8.1,
//     funded: 23000,
//     askingLoan: 8.1 * (cropData[1].tonPerHectare * cropData[1].pricePerTon),
//     avgHarvestPerYear: 2,
//     avgTimeBetweenHarvest: 6, // In months
//     estFullGrownDate: "", // String
//   },
// ];

const GlobalState = createContext<any>(undefined);

export const GlobalStateProvider = ({ children }: { children: any }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [farmersData, setFarmersData] = useState([]);
  const [investorsData, setInvestorsData] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState({
    tokenId: 0,
    cropData: cropData[0],
    fieldSize: 8.1,
    funded: 23000,
    askingLoan: 8.1 * (cropData[1].tonPerHectare * cropData[1].pricePerTon),
    avgHarvestPerYear: 2,
    avgTimeBetweenHarvest: 6, // In months
    estFullGrownDate: "", // String
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kycDone, setKycDone] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <GlobalState.Provider
      value={{
        isSwitchOn,
        setIsSwitchOn,
        toggleSwitch,
        farmersData,
        setFarmersData,
        selectedLoan,
        setSelectedLoan,
        investorsData,
        setInvestorsData,
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        kycDone,
        setKycDone,
      }}
    >
      {children}
    </GlobalState.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalState);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
