import { useContext } from "react";
import { ForzaContext, ForzaData } from "../context/Forza";

export function useForzaData(): ForzaData {
  return useContext(ForzaContext);
}