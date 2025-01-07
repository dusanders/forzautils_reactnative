import { useContext } from "react";
import { NavigationContext } from "../context/Navigator";

export function useNavigation() {
  return useContext(NavigationContext)
}