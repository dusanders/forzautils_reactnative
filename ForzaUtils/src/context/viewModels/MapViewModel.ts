import { DirectionalData } from "ForzaTelemetryApi";
import { useEffect, useState } from "react";
import { useLogger } from "../Logger";
import { packetService } from "../../hooks/PacketState";

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
  const tag = 'MapViewModel';
  const logger = useLogger();
  const forza = packetService().packet;
  const [trackId, setTrackId] = useState(0);
  const [svg, setSvg] = useState('');
  const [viewBox, setViewBox] = useState<SvgViewBoxMeasures>(initialViewBox);
  const [position, setPosition] = useState<PlayerPosition | undefined>(undefined);

  const isValidNumber = (value: number) => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

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
    if (!forza || !forza.isRaceOn || !forza.trackId) {
      return;
    }
    if (trackId && forza?.trackId) {
      if (forza.trackId !== trackId) {
        logger.log(tag, `clean map`);
        setSvg('');
        setViewBox(initialViewBox);
        setPosition(undefined);
        setTrackId(forza.trackId);
        return;
      }
    }
    const formatted = formatPosition(forza.position);
    const playerPosition: PlayerPosition = {
      x: formatted.x,
      y: formatted.z
    }
    if (!isValidNumber(playerPosition.x) || !isValidNumber(playerPosition.y)) {
      return;
    }
    let path = svg
    if (!path.length) {
      path = `M${playerPosition.x.toFixed(1)},${playerPosition.y.toFixed(1)}`;
    } else if (path.length < 512) {
      path += `L${playerPosition.x.toFixed(1)},${playerPosition.y.toFixed(1)}`;
    }
    setSvg(path);
    setPosition(playerPosition);
    setTrackId(forza?.trackId || 0);
  }, [forza?.position]);

  return {
    svgPath: svg,
    playerPosition: position,
    viewBox: viewBox,
    trackId: trackId,
    svgHeight: 100,
    svgWidth: 350
  }
}