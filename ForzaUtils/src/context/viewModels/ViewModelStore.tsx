import React, { createContext, useContext } from "react";
import { IHpTqGraphViewModel, useHpTqGraphViewModel } from "./HpTqGraphViewModel";
import { ISuspensionGraphViewModel, useSuspensionGraphViewModel } from "./SuspensionGraphViewModel";
import { ITireTempViewModel, useTireTempsViewModel } from "./TireTempViewModel";
import { IGripViewModel, useGripViewModel } from "./GripViewModel";

export interface IViewModelStore {
  hpTqGraph: IHpTqGraphViewModel;
  suspensionGraph: ISuspensionGraphViewModel;
  tireTemps: ITireTempViewModel;
  grip: IGripViewModel;
}

export const ViewModelStore = createContext({} as IViewModelStore);

export interface ViewModelStore_HocProps {
  children?: any;
}

export function ViewModelStore_Hoc(props: ViewModelStore_HocProps) {
  const hpTqVM = useHpTqGraphViewModel();
  const suspensionGraphVm = useSuspensionGraphViewModel();
  const tireTempVm = useTireTempsViewModel();
  const gripVm = useGripViewModel();
  /** Provide a centralized HoC / Context that will track view models */
  return (
    <ViewModelStore.Provider value={{
      hpTqGraph: hpTqVM,
      suspensionGraph: suspensionGraphVm,
      tireTemps: tireTempVm,
      grip: gripVm
    }}>
      {props.children}
    </ViewModelStore.Provider>
  )
}

export function useViewModelStore() {
  return useContext(ViewModelStore);
}