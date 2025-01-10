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