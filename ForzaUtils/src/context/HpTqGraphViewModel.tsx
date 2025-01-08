import React, { createContext, useEffect, useReducer } from "react";
import { INavigationTarget } from "./Navigator";
import { useForzaData } from "../hooks/useForzaData";
import { useLogger } from "./Logger";
import { StateHandler } from "../constants/types";

export interface HpTqGraphViewModelProps extends INavigationTarget {
  children?: any;
}

export interface IHpTqGraphViewModel {
  data?: DataEvent
  gears: Map<number, GearData>;
}

export interface GearData {
  gear: number;
  events: DataEvent[]
}
export interface DataEvent {
  hp: number;
  tq: number;
  rpm: number;
  gear: number;
}

export const HpTqGraphViewModelContext = createContext({} as IHpTqGraphViewModel);

interface HpTqGraphViewModelState {
  gearMap: Map<number, GearData>;
  data?: DataEvent;
}
export function HpTqGraphViewModel(props: HpTqGraphViewModelProps) {
  const tag = 'HpTqGraphViewModel';
  const initialState: HpTqGraphViewModelState = {
    gearMap: new Map(),
  }
  const logger = useLogger();
  const forza = useForzaData();

  const updateMap = (prev: HpTqGraphViewModelState, next: Partial<HpTqGraphViewModelState>) => {
    if(!next.data) return;
    next.gearMap = prev.gearMap;
    if (!next.gearMap.has(next.data.gear)) {
      next.gearMap.set(next.data.gear, {
        gear: next.data.gear,
        events: [next.data]
      })
    } else {
      const gearInfo = next.gearMap.get(next.data.gear);
      const found = gearInfo?.events.find(i => i.rpm === next.data?.rpm);
      if (!found) {
        gearInfo?.events.push(next.data);
      } else {
        if (found.hp < next.data.hp) {
          found.hp = next.data.hp;
        }
        if (found.tq < next.data.tq) {
          found.tq = next.data.tq;
        }
      }
    }
  }

  const [state, setState] = useReducer<StateHandler<HpTqGraphViewModelState>>((prev, next) => {
    if (!next.data) {
      logger.warn(tag, `undefined data packet`);
    } else {
      updateMap(prev, next);
    }
    return {
      ...prev,
      ...next
    }
  }, initialState);

  useEffect(() => {
    if (!forza.packet) {
      logger.warn(tag, `undefined data packet`);
      return;
    }
    setState({
      data: {
        gear: forza.packet.gear,
        hp: forza.packet.getHorsepower(),
        tq: forza.packet.torque,
        rpm: forza.packet.rpmData.current
      }
    })
  }, [forza.packet]);

  useEffect(() => {
    
  }, [])

  return (
    <HpTqGraphViewModelContext.Provider value={{
      data: state.data,
      gears: state.gearMap
    }}>
      {props.children}
    </HpTqGraphViewModelContext.Provider>
  )
}