import { useLocaleStore } from "../../src/redux/AppStore";
import { ILocaleState, localeReducer, setLocale } from "../../src/redux/LocaleStore";
import { Strings_enUS } from "../../src/locale/enUS";
import { ISupportLocale } from "../../src/locale/strings";
import { Strings_fr } from "../../src/locale/fr";


describe('LocaleStore', () => {
  it('should return the initial state', () => {
    const initialState: ILocaleState = {
      type: ISupportLocale.enUS,
      strings: Strings_enUS
    };

    expect(localeReducer(undefined, { type: undefined as any })).toEqual(initialState);
  });
  it('should update the locale', () => {
    const initialState: ILocaleState = {
      type: ISupportLocale.enUS,
      strings: Strings_enUS
    };
    const state = useLocaleStore();
    expect(state.strings).toEqual(Strings_enUS);
    const action = setLocale(ISupportLocale.fr);
    const newState = localeReducer(initialState, action);
    expect(newState.strings).toEqual(Strings_fr)
  })
});