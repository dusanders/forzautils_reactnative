import { useEffect, useRef, useState } from "react";
import { useLogger } from "../Logger";
import { delay } from "../../types/types";
import { ForzaTelemetryApi, ITelemetryData } from "ForzaTelemetryApi";
import { useNetworkContext } from "../Network";
import { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";
import { useReplay } from "../Recorder";

export interface IHpTqGraphViewModel {
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
  },
  {
    rpm: 1234,
    hp: 43,
    tq: 23,
    gear: 2
  },
  {
    rpm: 1345,
    hp: 54,
    tq: 34,
    gear: 2
  },
  {
    rpm: 1451,
    hp: 65,
    tq: 72,
    gear: 2
  },
  {
    rpm: 1512,
    hp: 89,
    tq: 98,
    gear: 2
  },
  {
    rpm: 1645,
    hp: 98,
    tq: 102,
    gear: 2
  },
  {
    rpm: 1896,
    hp: 78,
    tq: 87,
    gear: 2
  },
  {
    rpm: 1932,
    hp: 65,
    tq: 76,
    gear: 2
  }
]

function roundToNearestRpmRange(rpm: number) {
  return Math.round(rpm / 100.0) * 100
}
export function useHpTqGraphViewModel(): IHpTqGraphViewModel {
  const DEBUG_Stream = async () => {
    for (const data of debugData) {
      insertEvent(data);
      await delay(100);
    }
  }
  const tag = 'HpTqGraphViewModel';
  const logger = useLogger();
  const replay = useReplay();
  const network = useNetworkContext();
  const isDebug = useRef(network.isDEBUG);
  const [forza, setForza] = useState<ITelemetryData | null>(null);
  const [gears, setGears] = useState<GearData[]>([]);


  const ignorePacket = () => {
    if (isDebug.current) {
      return false;
    }
    if (!forza ||
      !forza.isRaceOn ||
      forza.throttle < 50 ||
      forza.gear <= 0 ||
      forza.gear >= 11 ||
      ForzaTelemetryApi.getHorsepower(forza.power) < 0
    ) {
      // Ignore packet - there is no useful information here
      return true;
    }
    const existing = gears.find((ele) => ele.gear === forza?.gear);
    if (existing && existing.events?.length) {
      const last = existing.events[existing.events.length];
      if (last && (forza.rpmData.current < last.rpm)) {
        return;
      }
    }
    return false
  }

  const maybeUpdateEvent = (ev: DataEvent, newEvent: DataEvent): DataEvent => {
    const copy = { ...ev }
    let didUpdate = false;
    if (ev.hp < newEvent.hp) {
      copy.hp = newEvent.hp;
      didUpdate = true;
    }
    if (ev.tq < newEvent.tq) {
      copy.tq = newEvent.tq
      didUpdate = true;
    }
    return didUpdate ? copy : ev;
  }

  const insertEvent = (newEvent: DataEvent) => {
    setGears((prev) => {
      const exists = prev.find((i) => i.gear === newEvent.gear);
      if (!exists) {
        return [...prev, {
          gear: newEvent.gear,
          events: [newEvent]
        }];
      }

      const newState = prev.map((gear, index) => {
        if (gear.gear !== newEvent.gear) {
          return gear
        }
        let existing = gear.events.find((ev) => ev.rpm === newEvent.rpm);
        if (!existing) {
          gear.events = [...gear.events, newEvent]
        } else {
          gear.events = gear.events.map((ev) => {
            if (ev.rpm !== newEvent.rpm) {
              return ev;
            }
            return maybeUpdateEvent(ev, newEvent);
          }).sort((a, b) => a.rpm - b.rpm);
        }
        return gear;
      });
      return newState.sort((a, b) => a.gear - b.gear)
    });
  }

  const eventFromPacket = (packet: ITelemetryData): DataEvent => {
    return {
      gear: packet.gear,
      hp: Math.round(ForzaTelemetryApi.getHorsepower(packet.power)),
      tq: packet.torque,
      rpm: roundToNearestRpmRange(packet.rpmData.current)
    }
  }

  useEffect(() => {
    let packetSub: EmitterSubscription;
    if (network && !isDebug.current) {
      packetSub = network.onPacket((packet) => {
        setForza(packet);
      });
    }
    return () => {
      packetSub?.remove();
    };
  }, [network]);

  useEffect(() => {
    let packetSub: EmitterSubscription;
    if (replay) {
      packetSub = replay.onPacket((packet) => {
        setForza(packet);
      });
    }
    return () => {
      packetSub?.remove();
    };
  }, [replay]);

  useEffect(() => {
    if (!ignorePacket()) {
      insertEvent(eventFromPacket(forza!));
    }
  }, [forza]);

  return {
    gears: gears,
    clearCache: () => {
      logger.log(tag, `clearing cache`);
      setGears([]);
    },
    DEBUG_StartStream: () => {
      isDebug.current = true;
      DEBUG_Stream()
    }
  }
}