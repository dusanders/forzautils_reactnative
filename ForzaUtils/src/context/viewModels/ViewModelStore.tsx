import React, { createContext } from "react";
import { HpTqGraphViewModel, IHpTqGraphViewModel } from "./HpTqGraphViewModel";
import { ISuspensionGraphViewModel, SuspensionGraphViewModel } from "./SuspensionGraphViewModel";

export interface IViewModelStore {
  hpTqGraph: IHpTqGraphViewModel;
  suspensionGraph: ISuspensionGraphViewModel;
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
        <SuspensionGraphViewModel>
          {suspensionVm => (
            <ViewModelStore.Provider value={{
              hpTqGraph: hptqVm,
              suspensionGraph: suspensionVm
            }}>
              {props.children}
            </ViewModelStore.Provider>
          )}
        </SuspensionGraphViewModel>
      )}
    </HpTqGraphViewModel>
  )
}