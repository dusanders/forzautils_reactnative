import { useEffect, useMemo, useState } from "react";
import { AxleData, DataWindow, useDataWindow } from "../../types/types";
import { ITelemetryData } from "ForzaTelemetryApi/dist/TelemetryData";
import { useNetworkContext } from "../Network";
import { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";
import { useReplay } from "../Recorder";

export interface ISuspensionGraphViewModel {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
  windowSize: number;
  leftFrontWindow: DataWindow<number>;
  rightFrontWindow: DataWindow<number>;
  leftRearWindow: DataWindow<number>;
  rightRearWindow: DataWindow<number>;
  avgTravel: AxleData<number>[];
  avgTravelMin: number;
  avgTravelMax: number;
}

export function useSuspensionGraphViewModel(): ISuspensionGraphViewModel {
  const tag = 'SuspensionGraphViewModel';
  const windowSize = 40;
  const replay = useReplay();
  const network = useNetworkContext();
  const [forza, setForza] = useState<ITelemetryData | null>(null);

  const avgTravelWindow = useDataWindow<AxleData<number>>(
    windowSize,
    (data) => Math.min(data.front, data.rear),
    (data) => Math.max(data.front, data.rear),
    []
  );

  const frontLeftWindow = useDataWindow<number>(
    windowSize,
    (data) => data,
    (data) => data,
    []
  );
  const frontRightWindow = useDataWindow<number>(
    windowSize,
    (data) => data,
    (data) => data,
    []
  );
  const rearLeftWindow = useDataWindow<number>(
    windowSize,
    (data) => data,
    (data) => data,
    []
  );
  const rearRightWindow = useDataWindow<number>(
    windowSize,
    (data) => data,
    (data) => data,
    []
  );

  useEffect(() => {
    if (!forza || !forza.isRaceOn) {
      return;
    }
    if (forza?.normalizedSuspensionTravel) {
      avgTravelWindow.add({
        front: (forza.normalizedSuspensionTravel.leftFront + forza.normalizedSuspensionTravel.rightFront) / 2,
        rear: (forza.normalizedSuspensionTravel.leftRear + forza.normalizedSuspensionTravel.rightRear) / 2
      });
      frontLeftWindow.add(forza.normalizedSuspensionTravel.leftFront);
      frontRightWindow.add(forza.normalizedSuspensionTravel.rightFront);
      rearLeftWindow.add(forza.normalizedSuspensionTravel.leftRear);
      rearRightWindow.add(forza.normalizedSuspensionTravel.rightRear);
    }
  }, [forza?.normalizedSuspensionTravel]);

  const leftFront = useMemo(() =>
    forza?.normalizedSuspensionTravel?.leftFront || 0,
    [forza?.normalizedSuspensionTravel?.leftFront]
  );
  const rightFront = useMemo(() =>
    forza?.normalizedSuspensionTravel?.rightFront || 0,
    [forza?.normalizedSuspensionTravel?.rightFront]
  );
  const leftRear = useMemo(() =>
    forza?.normalizedSuspensionTravel?.leftRear || 0,
    [forza?.normalizedSuspensionTravel?.leftRear]
  );
  const rightRear = useMemo(() =>
    forza?.normalizedSuspensionTravel?.rightRear || 0,
    [forza?.normalizedSuspensionTravel?.rightRear]
  );

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
    leftFront: leftFront,
    leftRear: leftRear,
    rightFront: rightFront,
    rightRear: rightRear,
    windowSize: windowSize,
    leftFrontWindow: frontLeftWindow,
    rightFrontWindow: frontRightWindow,
    leftRearWindow: rearLeftWindow,
    rightRearWindow: rearRightWindow,
    avgTravel: avgTravelWindow.data,
    avgTravelMin: avgTravelWindow.min,
    avgTravelMax: avgTravelWindow.max
  };
}