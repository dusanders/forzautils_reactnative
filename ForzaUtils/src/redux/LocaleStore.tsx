import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocaleType } from "../constants/types";
import { Strings_enUS } from "../locale/enUS";
import { IStringDefinitions } from "../locale/strings";
import { useDispatch } from "react-redux";
import { AppStoreState } from "./AppStore";

export interface ILocaleState {
  type: LocaleType
  strings: IStringDefinitions;
}

const initialState: ILocaleState = {
  type: 'enUS',
  strings: Strings_enUS
}

export interface ILocaleActions {
  setLocale: (state: ILocaleState, action: { payload: { current: LocaleType } }) => void;
}

const localeSlice = createSlice({
  name: 'locale',
  initialState: initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<LocaleType>) => {
      state.type = action.payload;
      state.strings = action.payload === 'enUS'
        ? Strings_enUS
        : Strings_enUS
    }
  }
});

export const { setLocale } = localeSlice.actions;
export const localeReducer = localeSlice.reducer;
export const useSetLocale = () => {
  const dispatch = useDispatch();
  return (locale: LocaleType) => dispatch(setLocale(locale));
}
export const getLocale = (state: AppStoreState) => state.locale.type;
export const getStrings = (state: AppStoreState) => state.locale.strings;