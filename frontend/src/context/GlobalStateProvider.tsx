import { createContext, useContext, useState } from "react";

// type GlobalProviderType = {
//   employee: any;
//   setEmployee: (value: any) => void;
// };

const GlobalState = createContext<any>(undefined);

export const GlobalStateProvider = ({ children }: { children: any }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const toggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <GlobalState.Provider
      value={{
        isSwitchOn,
        setIsSwitchOn,
        toggleSwitch,
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
