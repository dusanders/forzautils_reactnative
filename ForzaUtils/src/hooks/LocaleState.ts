import { atom, useAtomValue } from "jotai";
import { Strings_enUS } from "../locale/enUS";
import { ISupportLocale, IStringDefinitions } from "../locale/strings";


export interface ILocaleState {
  type: ISupportLocale
  strings: IStringDefinitions;
}
const initialState: ILocaleState = {
  type: ISupportLocale.enUS,
  strings: Strings_enUS
}
export const localeState = atom<ILocaleState>(initialState);
export const localeAtom = atom((get) => get(localeState).strings);
export const localeTypeAtom = atom((get) => get(localeState).type);
export const setLocaleAtom = atom(
  initialState,
  (get, set, newLocale: ISupportLocale) => {
    const currentLocale = get(localeState);
    set(localeState, {
      ...currentLocale,
      type: newLocale,
      strings: newLocale === ISupportLocale.enUS ? Strings_enUS : Strings_enUS,
    });
  }
);
export const useCurrentLocale = () => {
  return useAtomValue(localeAtom);
}