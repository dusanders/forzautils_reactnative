import React, { createContext } from "react";
import { HpTqGraphViewModel, HpTqGraphViewModelContext, IHpTqGraphViewModel } from "./HpTqGraphViewModel";
import { AppRoutes } from "../constants/types";

export interface IViewModelStore {
  hpTqGraph: IHpTqGraphViewModel;
}

export const ViewModelStore = createContext({} as IViewModelStore);

export interface ViewModelStore_HocProps {
  children?: any;
}

export function ViewModelStore_Hoc(props: ViewModelStore_HocProps) {
  return (
    <HpTqGraphViewModel route={AppRoutes.HP_TQ_GRAPH}>
      <HpTqGraphViewModelContext.Consumer>
        {hptqVm => (
          <ViewModelStore.Provider value={{
            hpTqGraph: hptqVm
          }}>
            {props.children}
          </ViewModelStore.Provider>
        )}
      </HpTqGraphViewModelContext.Consumer>
    </HpTqGraphViewModel>
  )
}