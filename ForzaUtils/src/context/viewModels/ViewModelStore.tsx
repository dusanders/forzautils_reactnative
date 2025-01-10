import React, { createContext } from "react";
import { HpTqGraphViewModel, IHpTqGraphViewModel } from "./HpTqGraphViewModel";

export interface IViewModelStore {
  hpTqGraph: IHpTqGraphViewModel;
}

export const ViewModelStore = createContext({} as IViewModelStore);

export interface ViewModelStore_HocProps {
  children?: any;
}

export function ViewModelStore_Hoc(props: ViewModelStore_HocProps) {
  /** Provide a centralized HoC / Context that will track view models */
  return (
    <HpTqGraphViewModel>
        {hptqVm => (
          <ViewModelStore.Provider value={{
            hpTqGraph: hptqVm
          }}>
            {props.children}
          </ViewModelStore.Provider>
        )}
    </HpTqGraphViewModel>
  )
}