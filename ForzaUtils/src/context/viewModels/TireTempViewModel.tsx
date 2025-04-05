import { useMemo } from "react";
import { useForzaData } from "../../context/Forza";

export interface ITireTempViewModel {
  leftFront: number;
  rightFront: number;
  leftRear: number;
  rightRear: number;
}

export function useTireTempsViewModel(): ITireTempViewModel {
  const tag = `TireTempsViewModel`;
  const forza = useForzaData();
  const leftFront = useMemo(() =>
    Number(forza.packet?.tireTemp.leftFront.toFixed(2)) || 0,
    [forza.packet?.tireTemp.leftFront]
  );
  const rightFront = useMemo(() =>
    Number(forza.packet?.tireTemp.rightFront.toFixed(2)) || 0,
    [forza.packet?.tireTemp.rightFront]
  );
  const leftRear = useMemo(() =>
    Number(forza.packet?.tireTemp.leftRear.toFixed(2)) || 0,
    [forza.packet?.tireTemp.leftRear]
  );
  const rightRear = useMemo(() =>
    Number(forza.packet?.tireTemp.rightRear.toFixed(2)) || 0,
    [forza.packet?.tireTemp.rightRear]
  );

  return {
    leftFront: leftFront,
    rightFront: rightFront,
    leftRear: leftRear,
    rightRear: rightRear
  }
}