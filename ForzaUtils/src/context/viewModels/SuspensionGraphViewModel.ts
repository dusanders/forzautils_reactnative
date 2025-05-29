import { useEffect, useMemo } from "react";
import { AxleData, useDataWindow } from "../../constants/types";
import { useAtomValue } from "jotai";
import { packetAtom } from "../../hooks/PacketState";

export interface ISuspensionGraphViewModel {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
  windowSize: number;
  avgTravel: AxleData<number>[];
}
const debugData = [
  {
    front: 0.7,
    rear: -1.0
  },
  {
    front: -2.3,
    rear: 2.6
  },
  {
    front: 2.3,
    rear: -2.6
  },
  {
    front: -2.3,
    rear: 2.6
  },
  {
    front: 2.3,
    rear: -2.6
  },
  {
    front: -2.3,
    rear: 2.6
  },
  {
    front: 2.3,
    rear: 2.6
  },
  {
    front: -2.3,
    rear: 2.6
  },
  {
    front: 2.3,
    rear: -2.6
  },
  {
    front: -2.3,
    rear: 2.6
  },
  {
    front: 2.3,
    rear: 2.6
  },
  {
    front: -2.3,
    rear: 2.6
  },
  {
    front: 2.3,
    rear: -2.6
  },
  {
    front: -2.3,
    rear: 2.6
  },
  {
    front: 2.3,
    rear: 2.6
  },
  {
    front: -2.3,
    rear: 2.6
  },
  {
    front: 2.3,
    rear: -2.6
  },
  {
    front: -2.3,
    rear: 2.6
  },
  {
    front: 2.3,
    rear: 2.6
  },
  {
    front: -2.3,
    rear: 2.6
  }
]
export function useSuspensionGraphViewModel(): ISuspensionGraphViewModel {
  const tag = 'SuspensionGraphViewModel';
  const windowSize = 50;
  const forza = useAtomValue(packetAtom);
  const avgTravelWindow = useDataWindow<AxleData<number>>(windowSize);

  useEffect(() => {
    if (forza?.normalizedSuspensionTravel) {
      avgTravelWindow.add({
        front: (forza.normalizedSuspensionTravel.leftFront + forza.normalizedSuspensionTravel.rightFront) / 2,
        rear: (forza.normalizedSuspensionTravel.leftRear + forza.normalizedSuspensionTravel.rightRear) / 2
      });
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

  return {
    leftFront: leftFront,
    leftRear: leftRear,
    rightFront: rightFront,
    rightRear: rightRear,
    windowSize: windowSize,
    avgTravel: avgTravelWindow.data
  };
}