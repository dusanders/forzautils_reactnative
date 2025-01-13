import React, { useEffect, useMemo, useReducer } from "react";
import { StateHandler } from "../../constants/types";
import { useForzaData } from "../../hooks/useForzaData";
import { useLogger } from "../Logger";

export interface ITireTempViewModel {
  leftFront: number;
  rightFront: number;
  leftRear: number;
  rightRear: number;
}

export function useTireTempsViewModel(): ITireTempViewModel {
  const tag = `TireTempsViewModel`;
  const logger = useLogger();
  const forza = useForzaData();
  const leftFront = useMemo(() =>
    forza.packet?.formatDecimal(forza.packet.tireTemp.leftFront) || 0,
    [forza.packet?.tireTemp.leftFront]
  );
  const rightFront = useMemo(() =>
    forza.packet?.formatDecimal(forza.packet.tireTemp.rightFront) || 0,
    [forza.packet?.tireTemp.rightFront]
  );
  const leftRear = useMemo(() =>
    forza.packet?.formatDecimal(forza.packet.tireTemp.leftRear) || 0,
    [forza.packet?.tireTemp.leftRear]
  );
  const rightRear = useMemo(() =>
    forza.packet?.formatDecimal(forza.packet.tireTemp.rightRear) || 0,
    [forza.packet?.tireTemp.rightRear]
  );

  return {
    leftFront: leftFront,
    rightFront: rightFront,
    leftRear: leftRear,
    rightRear: rightRear
  }
}