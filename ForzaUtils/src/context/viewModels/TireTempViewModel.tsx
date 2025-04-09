import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getForzaPacket } from "../../redux/WifiStore";

export interface ITireTempViewModel {
  leftFront: number;
  rightFront: number;
  leftRear: number;
  rightRear: number;
}

export function useTireTempsViewModel(): ITireTempViewModel {
  const tag = `TireTempsViewModel`;
  const forza = useSelector(getForzaPacket);
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
    rightRear: rightRear
  }
}