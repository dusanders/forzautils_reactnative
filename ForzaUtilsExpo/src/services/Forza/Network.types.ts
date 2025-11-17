import { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";
import { ITelemetryData } from "shared";


export interface IForzaService {
  isUDPListening(): boolean;
  port: number;
  isDEBUG: boolean;
  lastPacket?: ITelemetryData;
  onPacket(fn: (packet: ITelemetryData) => void): EmitterSubscription;
  DEBUG(): void;
  STOP_DEBUG(): void;
}

export interface INetworkService {
  port: number;
  openSocket(port: number): Promise<void>;
  closeSocket(): Promise<void>;
  onSocketClosed(fn: () => void): EmitterSubscription;
  onSocketError(fn: (error: Error) => void): EmitterSubscription;
  onPacket(fn: (packet: ITelemetryData) => void): EmitterSubscription;
  DEBUG(): void;
  STOP_DEBUG(): void;
}
/**
 * Add Type for react-native-udp 'rinfo' object
 */
export interface Udp_rinfo {
  address: string,
  port: number,
  family: 'IPv4',
  size: number,
  ts: number,
}