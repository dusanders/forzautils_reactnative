import React, { ReactElement, useEffect, useMemo, useReducer } from "react";
import { StateHandler } from "../../constants/types";
import { useForzaData } from "../../hooks/useForzaData";
import { useLogger } from "../Logger";

export interface ISuspensionGraphViewModel {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
}

interface SuspensionGraphViewModelState {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
}

const initialState: SuspensionGraphViewModelState = {
  leftFront: 0,
  leftRear: 0,
  rightFront: 0,
  rightRear: 0
}

export function useSuspensionGraphViewModel(): ISuspensionGraphViewModel {
  const tag = 'SuspensionGraphViewModel';
  const logger = useLogger();
  const forza = useForzaData();
  const leftFront = useMemo(() =>
    forza.packet?.normalizedSuspensionTravel.leftFront || 0,
    [forza.packet?.normalizedSuspensionTravel.leftFront]
  );
  const rightFront = useMemo(() =>
    forza.packet?.normalizedSuspensionTravel.rightFront || 0,
    [forza.packet?.normalizedSuspensionTravel.rightFront]
  );
  const leftRear = useMemo(() =>
    forza.packet?.normalizedSuspensionTravel.leftRear || 0,
    [forza.packet?.normalizedSuspensionTravel.leftRear]
  );
  const rightRear = useMemo(() =>
    forza.packet?.normalizedSuspensionTravel.rightRear || 0,
    [forza.packet?.normalizedSuspensionTravel.rightRear]
  );

  return {
    leftFront: leftFront,
    leftRear: leftRear,
    rightFront: rightFront,
    rightRear: rightRear
  };
}