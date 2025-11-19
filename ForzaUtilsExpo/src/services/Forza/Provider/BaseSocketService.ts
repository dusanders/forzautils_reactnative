import { ITelemetryData } from "ForzaTelemetryApi";
import { EmitterSubscription } from "react-native";
import { INativeUDPService } from "../Network.types";

abstract class BaseSocketService implements INativeUDPService {
  protected static instance: BaseSocketService | null = null;
  static DEFAULT_PORT = 12345;

  static async Initialize<T extends BaseSocketService>(this: new () => T): Promise<INativeUDPService> {
    if (!BaseSocketService.instance) {
      BaseSocketService.instance = new this();
    }
    return BaseSocketService.instance;
  }

  static GetInstance(): INativeUDPService {
    if (!BaseSocketService.instance) {
      throw new Error("SocketService not initialized. Call SocketService.Initialize() first.");
    }
    return BaseSocketService.instance;
  }

  static SocketEvents = {
    SOCKET_CLOSED: "socket_closed",
    SOCKET_ERROR: "socket_error",
    PACKET: "packet"
  };

  port: number = -1;

  isListening(): boolean {
    return this.port !== -1;
  }
  
  abstract openSocket(port: number): Promise<void>;
  abstract closeSocket(): Promise<void>;
  abstract onSocketClosed(fn: () => void): EmitterSubscription;
  abstract onSocketError(fn: (error: Error) => void): EmitterSubscription;
  abstract onPacket(fn: (packet: ITelemetryData) => void): EmitterSubscription;
  abstract DEBUG(interval_ms: number): void;
  abstract STOP_DEBUG(): void;
}

export default BaseSocketService;