import React, { useEffect, useReducer } from "react";
import { useForzaData } from "../../hooks/useForzaData";
import { useLogger } from "../Logger";
import { delay, StateHandler } from "../../constants/types";

export interface IHpTqGraphViewModel {
  data?: DataEvent
  gears: GearData[];
  clearCache(): void;
  DEBUG_StartStream(): void;
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


const debugData: DataEvent[] = [
  {
    rpm: 1234,
    hp: 43,
    tq: 23,
    gear: 1
  },
  {
    rpm: 1345,
    hp: 54,
    tq: 34,
    gear: 1
  },
  {
    rpm: 1451,
    hp: 65,
    tq: 72,
    gear: 1
  },
  {
    rpm: 1512,
    hp: 89,
    tq: 98,
    gear: 1
  },
  {
    rpm: 1645,
    hp: 98,
    tq: 102,
    gear: 1
  },
  {
    rpm: 1896,
    hp: 78,
    tq: 87,
    gear: 1
  },
  {
    rpm: 1932,
    hp: 65,
    tq: 76,
    gear: 1
  }
]

interface HpTqGraphViewModelState {
  allData: GearData[]
  lastData?: DataEvent;
}
export function useHpTqGraphViewModel(): IHpTqGraphViewModel {
  const tag = 'HpTqGraphViewModel';
  const initialState: HpTqGraphViewModelState = {
    allData: [],
  }
  const logger = useLogger();
  const forza = useForzaData();

  const DEBUG_Stream = async () => {
    for (const data of debugData) {
      setState({
        lastData: {
          gear: data.gear,
          hp: data.hp,
          tq: data.tq,
          rpm: data.rpm
        }
      });
      await delay(100);
    }
  }

  const updateMap = (prev: HpTqGraphViewModelState, next: Partial<HpTqGraphViewModelState>) => {
    if (!next.lastData) return;
    next.allData = prev.allData.sort((a, b) => a.gear - b.gear);
    if (next.allData.length < next.lastData.gear) {
      next.allData.push({
        gear: next.lastData.gear,
        events: [next.lastData]
      });
    } else {
      const existingGear = next.allData[next.lastData.gear - 1];
      const dataPoint = existingGear.events.find((val) => val.rpm === next.lastData?.rpm);
      if (dataPoint) {
        if (dataPoint.hp < next.lastData.hp) {
          dataPoint.hp = next.lastData.hp;
        }
        if (dataPoint.tq < next.lastData.tq) {
          dataPoint.tq = next.lastData.tq
        }
      } else {
        existingGear.events.push(next.lastData)
      }
    }
  }

  const [state, setState] = useReducer<StateHandler<HpTqGraphViewModelState>>((prev, next) => {
    let result = {
      ...prev,
      ...next
    }
    if (!next.lastData) {
      logger.warn(tag, `undefined data packet`);
      return result;
    }
    if (next.lastData.gear < 1) {
      logger.warn(tag, `Ignore REVERSE gear!`);
      return result;
    }
    updateMap(prev, next);
    result = {
      ...prev,
      ...next
    }
    return result;
  }, initialState);

  useEffect(() => {
    if (!forza.packet) {
      logger.warn(tag, `undefined data packet`);
      return;
    }
    setState({
      lastData: {
        gear: forza.packet.gear,
        hp: forza.packet.getHorsepower(),
        tq: forza.packet.torque,
        rpm: forza.packet.rpmData.current
      }
    });
  }, [forza.packet]);

  return {
    data: state.lastData,
    gears: state.allData,
    clearCache: () => {
      setState({
        allData: [],
        lastData: undefined
      })
    },
    DEBUG_StartStream: () => {
      DEBUG_Stream()
    }
  }
}