import React, { useEffect, useMemo, useReducer } from "react";
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

function roundToNearestRpmRange(rpm: number) {
  return Math.round(rpm / 100.0) * 100
}
interface HpTqGraphViewModelState {
  allData: GearData[]
  lastData?: DataEvent;
}
export function useHpTqGraphViewModel(): IHpTqGraphViewModel {
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
  const tag = 'HpTqGraphViewModel';
  const initialState: HpTqGraphViewModelState = {
    allData: [],
  }
  const logger = useLogger();
  const forza = useForzaData();

  const updateMap = (prev: HpTqGraphViewModelState, next: Partial<HpTqGraphViewModelState>) => {
    if (!next.lastData) {
      logger.log(tag, `skipping - no data packet :: ${next.allData?.length} elements`);
      return next;
    }
    if (next.lastData.rpm == prev.lastData?.rpm) {
      console.log(`skipping same rpm`);
      return next;
    }
    next.allData = prev.allData.sort((a, b) => a.gear - b.gear);
    let existingGear = next.allData.find((ele) => ele.gear === next.lastData?.gear);
    if (!existingGear) {
      let index = next.allData.push({
        gear: next.lastData.gear,
        events: [next.lastData]
      });
      existingGear = next.allData[index - 1];
    }
    if (existingGear.gear != next.lastData.gear) {
      existingGear.gear = next.lastData.gear;
    }
    const dataPoint = existingGear.events.find((val) => val.rpm === next.lastData?.rpm);
    if (dataPoint) {
      if (next.lastData.hp - dataPoint.hp)
        if (dataPoint.hp < next.lastData.hp) {
          dataPoint.hp = next.lastData.hp;
        }
      if (dataPoint.tq < next.lastData.tq) {
        dataPoint.tq = next.lastData.tq
      }
    } else {
      existingGear.events.push(next.lastData)
      existingGear.events.sort((a, b) => a.rpm - b.rpm)
    }
    return next;
  }

  const ignorePacket = () => {
    if (!forza.packet) {
      logger.warn(tag, `undefined data packet`);
      return true;
    }
    if (!forza.packet.isRaceOn) {
      return true;
    }
    if (forza.packet.throttle < 50) {
      return true;
    }
    if (forza.packet.gear <= 0) {
      return true;
    }
    if (forza.packet.gear >= 11) {
      return true;
    }
    if (forza.packet.getHorsepower() < 0) {
      return true;
    }
    const existing = state.allData.find((ele) => ele.gear === forza.packet?.gear);
    if (existing && existing.events?.length) {
      const last = existing.events[existing.events.length];
      if (last && (forza.packet.rpmData.current < last.rpm)) {
        console.log(`skip decel`)
        return;
      }
    }
    return false
  }

  const [state, setState] = useReducer<StateHandler<HpTqGraphViewModelState>>((prev, next) => {
    // next.allData = allGears;
    let result = {
      ...prev,
      ...updateMap(prev, next)
    }
    return result;
  }, initialState);
  
  useEffect(() => {
    if (!ignorePacket()) {
      setState({
        lastData: {
          gear: forza.packet!.gear,
          hp: forza.packet!.getHorsepower(),
          tq: forza.packet!.torque,
          rpm: roundToNearestRpmRange(forza.packet!.rpmData.current)
        }
      });
    }
  }, [forza.packet]);

  return {
    data: state.lastData,
    gears: state.allData,
    clearCache: () => {
      logger.log(tag, `clearing cache`);
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