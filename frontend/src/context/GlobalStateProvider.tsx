import { createContext, useContext, useState } from "react";

type GlobalProviderType = {
  employee: any;
  setEmployee: (value: any) => void;
};

const GlobalState = createContext<GlobalProviderType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: any }) => {
  const [employee, setEmployee] = useState([]);

  return (
    <GlobalState.Provider
      value={{
        employee,
        setEmployee,
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