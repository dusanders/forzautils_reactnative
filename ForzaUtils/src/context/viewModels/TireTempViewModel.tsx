import { useContext, useEffect, useMemo } from "react";
import { useDataWindow } from "../../constants/types";
import { useSelector } from "react-redux";
import { getForzaPacket } from "../../redux/WifiStore";

export interface AverageTempData {
  front: number;
  rear: number;
}
export interface ITireTempViewModel {
  leftFront: number;
  rightFront: number;
  leftRear: number;
  rightRear: number;
  avgTempWindowSize: number;
  avgTemps: AverageTempData[];
}
const debugData: AverageTempData[] = [
  { front: 180, rear: 180 },
  { front: 180, rear: 180 },
  { front: 180, rear: 180 },
  { front: 180, rear: 180 },
  { front: 212, rear: 210 },
  { front: 212, rear: 210 },
  { front: 212, rear: 210 },
  { front: 212, rear: 210 },
  { front: 198, rear: 195 },
  { front: 196, rear: 194 },
  { front: 195, rear: 192 },
  { front: 198, rear: 193 },
  { front: 201, rear: 198 },
  { front: 208, rear: 205 },
  { front: 210, rear: 207 },
  { front: 212, rear: 210 },
  { front: 212, rear: 210 },
  { front: 212, rear: 210 },
  { front: 212, rear: 210 },
  { front: 198, rear: 195 },
  { front: 196, rear: 194 },
  { front: 195, rear: 192 },
]
export function useTireTempsViewModel(): ITireTempViewModel {
  const tag = `TireTempsViewModel`;
  const windowSize = 50;
  const forza = useSelector(getForzaPacket);
  const avgTempWindow = useDataWindow<AverageTempData>(windowSize);

  useEffect(() => {
    if (forza?.tireTemp) {
      const leftFront = Number(forza.tireTemp.leftFront?.toFixed(2)) || 0;
      const rightFront = Number(forza.tireTemp.rightFront?.toFixed(2)) || 0;
      const leftRear = Number(forza.tireTemp.leftRear?.toFixed(2)) || 0;
      const rightRear = Number(forza.tireTemp.rightRear?.toFixed(2)) || 0;
      const frontAvg = (leftFront + rightFront) / 2;
      const rearAvg = (leftRear + rightRear) / 2;
      avgTempWindow.add({
        front: Number(frontAvg.toFixed(2)),
        rear: Number(rearAvg.toFixed(2))
      });
    }
  }, [forza?.tireTemp]);

  const leftFront = useMemo(() =>
    Number(forza?.tireTemp?.leftFront?.toFixed(2)) || 0,
    [forza?.tireTemp.leftFront]
  );
  const rightFront = useMemo(() =>
    Number(forza?.tireTemp?.rightFront?.toFixed(2)) || 0,
    [forza?.tireTemp.rightFront]
  );
  const leftRear = useMemo(() =>
    Number(forza?.tireTemp?.leftRear?.toFixed(2)) || 0,
    [forza?.tireTemp.leftRear]
  );
  const rightRear = useMemo(() =>
    Number(forza?.tireTemp?.rightRear?.toFixed(2)) || 0,
    [forza?.tireTemp.rightRear]
  );

  return {
    leftFront: leftFront,
    rightFront: rightFront,
    leftRear: leftRear,
    rightRear: rightRear,
    avgTempWindowSize: windowSize,
    avgTemps: avgTempWindow.data,
  }
}