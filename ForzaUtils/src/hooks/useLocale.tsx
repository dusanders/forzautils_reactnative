import React, { useContext } from "react";
import { LocaleContext } from "../context/Locale";


export function useLocale() {
  return useContext(LocaleContext);
}