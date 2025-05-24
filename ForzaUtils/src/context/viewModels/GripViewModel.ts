import { useEffect, useMemo } from "react";
import { TireData } from "ForzaTelemetryApi";
import { packetAtom } from "../../hooks/PacketState";
import { useAtomValue } from "jotai";
import { AxleData, useDataWindow } from "../../constants/types";


export interface IGripViewModel {
  steering: number;
  throttle: number;
  brake: number;
  slipRatio: TireData;
  slipAngle: AxleData<number>[];
  slipAngleWindowSize: number;
}

export function useGripViewModel(): IGripViewModel {
  const forza = useAtomValue(packetAtom);
  const windowSize = 50;
  const slipAngleWindow = useDataWindow<AxleData<number>>(windowSize);

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

  return {
    steering: steering,
    throttle: throttle,
    brake: brake,
    slipRatio: tireSlip,
    slipAngle: slipAngleWindow.data,
    slipAngleWindowSize: windowSize
  }
}