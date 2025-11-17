import { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";
import { ITelemetryData } from "shared";


export interface IForzaService {
  isUDPListening(): boolean;
  port: number;
  isDEBUG: boolean;
  lastPacket?: ITelemetryData;
  onPacket(fn: (packet: ITelemetryData) => void): EmitterSubscription;
  shutdown(): Promise<void>;
  DEBUG(interval_ms: number): void;
  STOP_DEBUG(): void;
}

export interface INativeUDPService {
  port: number;
  isListening(): boolean;
  openSocket(port: number): Promise<void>;
  closeSocket(): Promise<void>;
  onSocketClosed(fn: () => void): EmitterSubscription;
  onSocketError(fn: (error: Error) => void): EmitterSubscription;
  onPacket(fn: (packet: ITelemetryData) => void): EmitterSubscription;
  DEBUG(interval_ms: number): void;
  STOP_DEBUG(): void;
}