import { createContext, useContext, useState } from "react";

type GlobalContextType = {
  page: string;
  setPage: (value: string) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState("addinvoices");

  return (
    <GlobalContext.Provider value={{ page, setPage }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used inside GlobalProvider");
  }
  return context;
}
