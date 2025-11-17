import { ITelemetryData } from "ForzaTelemetryApi";
import { EmitterSubscription } from "react-native";
import { INetworkService } from "../Network.types";
import BaseSocketService from "./BaseSocketService";

const TAG = "Provider.ts[SocketService]";
class SocketService extends BaseSocketService {
  static async Initialize(): Promise<INetworkService> {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
  static GetInstance(): INetworkService {
    if (!SocketService.instance) {
      throw new Error("SocketService not initialized. Call SocketService.Initialize() first.");
    }
    return SocketService.instance;
  }
  static SocketEvents = {
    SOCKET_CLOSED: "socket_closed",
    SOCKET_ERROR: "socket_error",
    PACKET: "packet"
  }
  static instance: SocketService;
  port: number = -1;
  openSocket(port: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  closeSocket(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onSocketClosed(fn: () => void): EmitterSubscription {
    throw new Error("Method not implemented.");
  }
  onSocketError(fn: (error: Error) => void): EmitterSubscription {
    throw new Error("Method not implemented.");
  }
  onPacket(fn: (packet: ITelemetryData) => void): EmitterSubscription {
    throw new Error("Method not implemented.");
  }
  DEBUG(): void {
    throw new Error("Method not implemented.");
  }
  STOP_DEBUG(): void {
    throw new Error("Method not implemented.");
  }
}

export default SocketService;