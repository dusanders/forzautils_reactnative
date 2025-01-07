import { useContext } from "react";
import { ForzaContext, ForzaData } from "../context/ForzaData";

export function useForzaData(): ForzaData {
  return useContext(ForzaContext);
}