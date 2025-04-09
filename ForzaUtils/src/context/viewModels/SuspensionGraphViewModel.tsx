import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getForzaPacket } from "../../redux/WifiStore";

export interface ISuspensionGraphViewModel {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
}
export function useSuspensionGraphViewModel(): ISuspensionGraphViewModel {
  const tag = 'SuspensionGraphViewModel';
  const forza = useSelector(getForzaPacket);
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

  return {
    leftFront: leftFront,
    leftRear: leftRear,
    rightFront: rightFront,
    rightRear: rightRear
  };
}