import { createContext, useContext } from "react";

export const PengajuanContext = createContext(null);

export function usePengajuan() {
  const context = useContext(PengajuanContext);

  if (!context) {
    throw new Error("usePengajuan must be used within PengajuanProvider");
  }

  return context;
}