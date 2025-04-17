import React, { useContext, useMemo } from "react";
import { TireData } from "ForzaTelemetryApi";
import { useSelector } from "react-redux";
import { ForzaPacketContext } from "../Network";


export interface IGripViewModel {
  steering: number;
  throttle: number;
  brake: number;
  slipRatio: TireData;
}

export function useGripViewModel(): IGripViewModel {
  const forza = useContext(ForzaPacketContext).packet;
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

  return {
    steering: steering,
    throttle: throttle,
    brake: brake,
    slipRatio: tireSlip
  }
}