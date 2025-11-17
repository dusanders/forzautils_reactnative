import { ITelemetryData } from "ForzaTelemetryApi";
import { EmitterSubscription } from "react-native";
import { INetworkService } from "../Network.types";

abstract class BaseSocketService implements INetworkService {
  protected static instance: BaseSocketService | null = null;

  static async Initialize<T extends BaseSocketService>(this: new () => T): Promise<INetworkService> {
    if (!BaseSocketService.instance) {
      BaseSocketService.instance = new this();
    }
    return BaseSocketService.instance;
  }

  static GetInstance(): INetworkService {
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

  abstract openSocket(port: number): Promise<void>;
  abstract closeSocket(): Promise<void>;
  abstract onSocketClosed(fn: () => void): EmitterSubscription;
  abstract onSocketError(fn: (error: Error) => void): EmitterSubscription;
  abstract onPacket(fn: (packet: ITelemetryData) => void): EmitterSubscription;
  abstract DEBUG(): void;
  abstract STOP_DEBUG(): void;
}

export default BaseSocketService;