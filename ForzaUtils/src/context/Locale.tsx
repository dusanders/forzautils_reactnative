import { createContext, useContext, useReducer } from "react";
import { IStringDefinitions, ISupportLocale } from "../locale/strings";
import { Strings_enUS } from "../locale/enUS";
import { StateHandler } from "../constants/types";

export interface ILocaleContext {
  strings: IStringDefinitions;
  current: ISupportLocale;
  setLocale(locale: ISupportLocale): void;
}

class LocaleProvider {
  readonly current: ISupportLocale;
  readonly strings: IStringDefinitions;
  constructor(locale: ISupportLocale) {
    this.current = locale
    this.strings = this.getStrings();
  }
  private getStrings() {
    switch(this.current) {
      case ISupportLocale.enUS:
        return new Strings_enUS();
    }
    return new Strings_enUS();
  }
}
export const LocaleContext = createContext({} as ILocaleContext);

export interface LocaleContextHocProps {
  children?: any;
}
interface LocaleContextState {
  provider: LocaleProvider;
}
const initialState: LocaleContextState = {
  provider: new LocaleProvider(ISupportLocale.enUS)
}
export function LocaleContextHoc(props: LocaleContextHocProps) {
  const [state, setState] = useReducer<StateHandler<LocaleContextState>>((prev, next) =>{
    return {
      ...prev,
      ...next
    }
  }, initialState);

  return (
    <LocaleContext.Provider value={{
      current: state.provider.current,
      strings: state.provider.strings,
      setLocale: (locale) => {
        setState({
          provider: new LocaleProvider(locale)
        })
      }
    }}>
      {props.children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext);
}