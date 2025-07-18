import { atom, useAtomValue, useSetAtom } from "jotai";
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
const localeState = atom<ILocaleState>(initialState);
const localeAtom = atom((get) => get(localeState).strings);
const localeTypeAtom = atom((get) => get(localeState).type);
const setLocaleAtom = atom(
  initialState,
  (get, set, newLocale: ISupportLocale) => {
    console.log("ATOM: Setting locale to:", newLocale);
    const currentLocale = get(localeState);
    set(localeState, {
      ...currentLocale,
      type: newLocale,
      strings: newLocale === ISupportLocale.enUS ? Strings_enUS : Strings_enUS,
    });
  }
);

export function localeService() {
  const locale = useAtomValue(localeAtom);
  const localeType = useAtomValue(localeTypeAtom);
  const setLocal = useSetAtom(setLocaleAtom);
  const setLocale = (newLocale: ISupportLocale) => {
    setLocal(newLocale);
  };
  return {
    locale,
    localeType,
    setLocale,
  };
}