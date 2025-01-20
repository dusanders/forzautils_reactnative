import { DirectionalData } from "ForzaTelemetryApi";
import { memo, useEffect, useMemo, useState } from "react";
import { useForzaData } from "../../hooks/useForzaData";

export interface IMapViewModel {
  position: DirectionalData[];
  isOnTrack: boolean;
}

export function useMapViewModel(): IMapViewModel {
  const forza = useForzaData();
  const [mapCoords, setMapCoords] = useState<DirectionalData[]>([]);

  const formatPosition = (position: DirectionalData) => {
    const scaleFactorX = 0.005;
    const scaleFactorY = 0.005
    position.x = Number((position.x * scaleFactorX).toFixed(3));
    position.y = Number((position.y * scaleFactorY).toFixed(3));
    position.z = Number((position.z * scaleFactorY).toFixed(3));
    return position;
  }

  useEffect(() => {
    if (!forza.packet?.position) {
      return;
    }
    setMapCoords([...mapCoords, formatPosition(forza.packet.position)])
  }, [forza.packet?.position]);

  return {
    position: mapCoords,
    isOnTrack: forza.packet?.isOnTrack || false
  }
}