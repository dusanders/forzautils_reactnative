import { IStringDefinitions, IStrings_Generic } from "../src/locale/strings";

export class mockStrings_enUS implements IStringDefinitions {
  appName: string = "Forza Utils";
  generics: IStrings_Generic = {
    loading: "Loading"
  };
}