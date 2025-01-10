import React, { createContext } from "react";
import { IHpTqGraphViewModel, useHpTqGraphViewModel } from "./HpTqGraphViewModel";
import { ISuspensionGraphViewModel, useSuspensionGraphViewModel } from "./SuspensionGraphViewModel";

export interface IViewModelStore {
  hpTqGraph: IHpTqGraphViewModel;
  suspensionGraph: ISuspensionGraphViewModel;
}

export const ViewModelStore = createContext({} as IViewModelStore);

export interface ViewModelStore_HocProps {
  children?: any;
}

export function ViewModelStore_Hoc(props: ViewModelStore_HocProps) {
  const hpTqVM = useHpTqGraphViewModel();
  const suspensionGraphVm = useSuspensionGraphViewModel();
  /** Provide a centralized HoC / Context that will track view models */
  return (
    <ViewModelStore.Provider value={{
      hpTqGraph: hpTqVM,
      suspensionGraph: suspensionGraphVm
    }}>
      {props.children}
    </ViewModelStore.Provider>
  )
}