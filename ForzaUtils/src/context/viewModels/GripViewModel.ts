import { useEffect, useMemo, useState } from "react";
import { ITelemetryData, TireData } from "ForzaTelemetryApi";
import { AxleData, useDataWindow } from "../../types/types";
import { useNetworkContext } from "../Network";
import { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";
import { useReplay } from "../Recorder";


export interface IGripViewModel {
  steering: number;
  throttle: number;
  brake: number;
  slipRatio: TireData;
  slipAngle: AxleData<number>[];
  slipAngleWindowSize: number;
  slipAngleMin: number;
  slipAngleMax: number;
}

export function useGripViewModel(): IGripViewModel {
  const network = useNetworkContext();
  const replay = useReplay();
  const [forza, setForza] = useState<ITelemetryData | null>(null);
  const windowSize = 50;
  const slipAngleWindow = useDataWindow<AxleData<number>>(
    windowSize,
    (data) => Math.min(data.front, data.rear),
    (data) => Math.max(data.front, data.rear),
    []
  );

  const steering = useMemo(() => {
    return forza?.steer || 0
  }, [forza?.steer]);
  const throttle = useMemo(() => {
    return forza?.throttle || 0
  }, [forza?.throttle]);
  const brake = useMemo(() => {
    return forza?.brake || 0
  }, [forza?.brake]);
  const tireSlip = useMemo(() => {
    return forza?.tireSlipRatio
      ? {
        leftFront: Number(forza.tireSlipRatio.leftFront.toFixed(2)),
        rightFront: Number(forza.tireSlipRatio.rightFront.toFixed(2)),
        leftRear: Number(forza.tireSlipRatio.leftRear.toFixed(2)),
        rightRear: Number(forza.tireSlipRatio.rightRear.toFixed(2))
      }
      : {
        leftFront: 0,
        rightFront: 0,
        leftRear: 0,
        rightRear: 0
      }
  }, [forza?.tireSlipRatio]);

  useEffect(() => {
    if (!forza || !forza.isRaceOn) {
      return;
    }
    const data: TireData = {
      leftFront: Number(forza?.tireSlipAngle?.leftFront.toFixed(2)) || 0,
      rightFront: Number(forza?.tireSlipAngle?.rightFront.toFixed(2)) || 0,
      leftRear: Number(forza?.tireSlipAngle?.leftRear.toFixed(2)) || 0,
      rightRear: Number(forza?.tireSlipAngle?.rightRear.toFixed(2)) || 0
    }
    slipAngleWindow.add({
      front: (data.leftFront + data.rightFront) / 2,
      rear: (data.leftRear + data.rightRear) / 2,
    });
  }, [forza?.tireSlipAngle]);

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
    steering: steering,
    throttle: throttle,
    brake: brake,
    slipRatio: tireSlip,
    slipAngle: slipAngleWindow.data,
    slipAngleWindowSize: windowSize,
    slipAngleMin: slipAngleWindow.min,
    slipAngleMax: slipAngleWindow.max
  }
}