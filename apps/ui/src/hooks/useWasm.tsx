import { useContext } from "react";
import { WasmContext } from "../contexts/WasmContext";

export const useWasm = () => {
  const context = useContext(WasmContext);
  if (context === undefined) {
    throw new Error("useWasm must be used within a WasmProvider");
  }
  return context;
};
