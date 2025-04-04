import { DirectionalData } from "ForzaTelemetryApi";
import { useEffect, useState } from "react";
import { useForzaData } from "../../hooks/useForzaData";

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface SvgViewBoxMeasures {
  minY: number;
  minX: number;
  maxY: number;
  maxX: number;
}

export interface IMapViewModel {
  svgPath: string;
  viewBox: SvgViewBoxMeasures;
  playerPosition: PlayerPosition | undefined;
  trackId: number;
  svgHeight: number;
  svgWidth: number;
}

function formatPosition(position: DirectionalData) {
  const copy: DirectionalData = {
    x: position.x,
    y: position.y,
    z: position.z
  }
  const scaleFactorX = 0.005;
  const scaleFactorY = 0.005
  copy.x = Number((position.x * scaleFactorX).toFixed(3));
  copy.y = Number((position.y * scaleFactorY).toFixed(3));
  copy.z = Number((position.z * scaleFactorY).toFixed(3));
  return copy;
}

const initialViewBox: SvgViewBoxMeasures = {
  maxX: Number.MIN_SAFE_INTEGER,
  maxY: Number.MIN_SAFE_INTEGER,
  minX: Number.MAX_SAFE_INTEGER,
  minY: Number.MAX_SAFE_INTEGER
}

export function useMapViewModel(): IMapViewModel {
  const forza = useForzaData();
  const [trackId, setTrackId] = useState(0);
  const [svg, setSvg] = useState('');
  const [viewBox, setViewBox] = useState<SvgViewBoxMeasures>(initialViewBox);
  const [position, setPosition] = useState<PlayerPosition | undefined>(undefined);

  useEffect(() => {
    let newMinY = Math.min(viewBox.minY, (position?.y || -1));
    let newMinX = Math.min(viewBox.minX, (position?.x || -1));
    let newMaxY = Math.max(viewBox.maxY, (position?.y || 1));
    let newMaxX = Math.max(viewBox.maxX, (position?.x || 1));

    setViewBox({
      maxX: newMaxX,
      minX: newMinX,
      maxY: newMaxY,
      minY: newMinY
    });
  }, [position]);

  useEffect(() => {
    if (!forza.packet || !forza.packet.isRaceOn || !forza.packet.trackId) {
      return;
    }
    if (trackId && forza.packet?.trackId) {
      if (forza.packet.trackId !== trackId) {
        console.log(`clean map`);
        setSvg('');
        setViewBox(initialViewBox);
        setPosition(undefined);
        setTrackId(forza.packet.trackId);
        return;
      }
    }
    const formatted = formatPosition(forza.packet.position);
    const playerPosition: PlayerPosition = {
      x: formatted.x,
      y: formatted.z
    }
    let path = svg
    if (!path.length) {
      path = `M${playerPosition.x},${playerPosition.y}`;
    } else {
      path += `L${playerPosition.x},${playerPosition.y}`;
    }
    setSvg(path);
    setPosition(playerPosition);
    setTrackId(forza.packet?.trackId || 0);
  }, [forza.packet?.position]);

  return {
    svgPath: svg,
    playerPosition: position,
    viewBox: viewBox,
    trackId: trackId,
    svgHeight: 300,
    svgWidth: 350
  }
}