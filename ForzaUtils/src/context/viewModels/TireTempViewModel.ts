import { useEffect, useMemo, useState } from "react";
import { AxleData, DataWindow, useDataWindow } from "../../types/types";
import { useNetworkContext } from "../Network";
import { ITelemetryData, TireData } from "ForzaTelemetryApi";
import { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";
import { useReplay } from "../Recorder";

export interface ITireTempViewModel {
  tireDataWindow: DataWindow<TireData>;
  avgTempWindowSize: number;
  avgTempWindowMin: number;
  avgTempWindowMax: number;
  avgTemps: AxleData<number>[];
}

export function useTireTempsViewModel(): ITireTempViewModel {
  const tag = `TireTempsViewModel`;
  const windowSize = 50;
  const network = useNetworkContext();
  const replay = useReplay();
  const [forza, setForza] = useState<ITelemetryData | null>(null);

  const tiresWindow = useDataWindow<TireData>(
    windowSize,
    (data) => Math.min(data.leftFront, data.rightFront, data.leftRear, data.rightRear),
    (data) => Math.max(data.leftFront, data.rightFront, data.leftRear, data.rightRear),
    []
  );

  const avgTempWindow = useDataWindow<AxleData<number>>(
    windowSize,
    (data) => Math.min(data.front, data.rear),
    (data) => Math.max(data.front, data.rear),
    []
  );

  useEffect(() => {
    if (!forza || !forza.isRaceOn) {
      return
    }
    if (forza?.tireTemp) {
      const leftFront = Number(forza.tireTemp.leftFront?.toFixed(2)) || 0;
      const rightFront = Number(forza.tireTemp.rightFront?.toFixed(2)) || 0;
      const leftRear = Number(forza.tireTemp.leftRear?.toFixed(2)) || 0;
      const rightRear = Number(forza.tireTemp.rightRear?.toFixed(2)) || 0;
      const frontAvg = (leftFront + rightFront) / 2;
      const rearAvg = (leftRear + rightRear) / 2;
      avgTempWindow.add({
        front: Number(frontAvg.toFixed(2)),
        rear: Number(rearAvg.toFixed(2))
      });
      tiresWindow.add({
        leftFront,
        rightFront,
        leftRear,
        rightRear,
      });
    }
  }, [forza?.tireTemp]);

  useEffect(() => {
    let packetSub: EmitterSubscription;
    if (network) {
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

  return {
    tireDataWindow: tiresWindow,
    avgTempWindowSize: windowSize,
    avgTempWindowMin: avgTempWindow.min,
    avgTempWindowMax: avgTempWindow.max,
    avgTemps: avgTempWindow.data,
  }
}