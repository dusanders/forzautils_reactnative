import React, { useMemo } from "react";
import { useForzaData } from "../../hooks/useForzaData";
import { TireData } from "ForzaTelemetryApi";


export interface IGripViewModel {
  steering: number;
  throttle: number;
  brake: number;
  slipRatio: TireData;
}

export function useGripViewModel(): IGripViewModel {
  const forza = useForzaData();
  const steering = useMemo(() => {
    return forza.packet?.steer || 0
  }, [forza.packet?.steer]);
  const throttle = useMemo(() => {
    return forza.packet?.throttle || 0
  }, [forza.packet?.throttle]);
  const brake = useMemo(() => {
    return forza.packet?.brake || 0
  }, [forza.packet?.brake]);
  const tireSlip = useMemo(() => {
    return forza.packet?.tireSlipRatio
      ? {
        leftFront: Number(forza.packet.tireSlipRatio.leftFront.toFixed(2)),
        rightFront: Number(forza.packet.tireSlipRatio.rightFront.toFixed(2)),
        leftRear: Number(forza.packet.tireSlipRatio.leftRear.toFixed(2)),
        rightRear: Number(forza.packet.tireSlipRatio.rightRear.toFixed(2))
      }
      : {
        leftFront: 0,
        rightFront: 0,
        leftRear: 0,
        rightRear: 0
      }
  }, [forza.packet?.tireSlipRatio]);

  return {
    steering: steering,
    throttle: throttle,
    brake: brake,
    slipRatio: tireSlip
  }
}