import { useMemo } from "react";
import { useForzaData } from "../../context/Forza";

export interface ISuspensionGraphViewModel {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
}
export function useSuspensionGraphViewModel(): ISuspensionGraphViewModel {
  const tag = 'SuspensionGraphViewModel';
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