import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Strings_enUS } from "../locale/enUS";
import { IStringDefinitions, ISupportLocale } from "../locale/strings";
import { useDispatch } from "react-redux";
import { AppStoreState } from "./AppStore";
import { Strings_fr } from "../locale/fr";

export interface ILocaleState {
  type: ISupportLocale
  strings: IStringDefinitions;
}

const initialState: ILocaleState = {
  type: ISupportLocale.enUS,
  strings: Strings_enUS
}

export interface ILocaleActions {
  setLocale: (state: ILocaleState, action: { payload: { current: ISupportLocale } }) => void;
}

const localeSlice = createSlice({
  name: 'locale',
  initialState: initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<ISupportLocale>) => {
      state.type = action.payload;
      state.strings = Strings_enUS;
      switch(action.payload) {
        case ISupportLocale.fr:
          state.strings = Strings_fr
      }
    }
  }
});

export const { setLocale } = localeSlice.actions;
export const localeReducer = localeSlice.reducer;
export const useSetLocale = () => {
  const dispatch = useDispatch();
  return (locale: ISupportLocale) => dispatch(setLocale(locale));
}
export const getLocale = (state: AppStoreState) => state.locale.type;
export const getStrings = (state: AppStoreState) => state.locale.strings;