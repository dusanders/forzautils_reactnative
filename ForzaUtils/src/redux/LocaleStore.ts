import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Strings_enUS } from "../locale/enUS";
import { IStringDefinitions, ISupportLocale } from "../locale/strings";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./AppStore";
import { Strings_fr } from "../locale/fr";

export interface ILocaleState {
  type: ISupportLocale
  strings: IStringDefinitions;
}

const localeSlice = createSlice({
  name: 'locale',
  initialState: {
    type: ISupportLocale.enUS,
    strings: Strings_enUS
  } as ILocaleState,
  reducers: {
    setLocale: (state, action: PayloadAction<ISupportLocale>) => {
      state.type = action.payload;
      state.strings = Strings_enUS;
      switch(action.payload) {
        case ISupportLocale.fr:
          state.strings = Strings_fr
      }
    },
  },
  selectors: {
    getLocale: (localeState: ILocaleState) => localeState.type,
    getStrings: (localeState: ILocaleState) => localeState.strings,
  }
});
export const localeReducer = localeSlice.reducer;

export function useLocaleViewModel() {
  const dispatch = useDispatch();
  return {
    getLocale: () => useAppSelector(state => localeSlice.selectors.getLocale(state)),
    getStrings: () => useAppSelector(state => localeSlice.selectors.getStrings(state)),
    setLocale: (type: ISupportLocale) => dispatch(localeSlice.actions.setLocale(type))
  }
}