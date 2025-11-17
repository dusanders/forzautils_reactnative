import { ITelemetryData } from "ForzaTelemetryApi";
import { EmitterSubscription } from "react-native";
import { INetworkService } from "../Network.types";
import BaseSocketService from "./BaseSocketService";
import { delay } from "@/helpers/misc";
import { ContextBridge_UDP, ElectronContextBridge } from "shared";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import { Logger } from "@/hooks/Logger";

const apiBridge = (window as any).electronAPI as ElectronContextBridge;

const TAG = "Provider.ts[SocketService]";
class SocketService extends BaseSocketService {
  static async Initialize(): Promise<INetworkService> {
    if (!BaseSocketService.instance) {
      BaseSocketService.instance = new SocketService();
      await (BaseSocketService.instance as SocketService).initialize();
    }
    return BaseSocketService.instance;
  }
  
  static SocketEvents = {
    SOCKET_CLOSED: "socket_closed",
    SOCKET_ERROR: "socket_error",
    PACKET: "packet"
  }
  static instance: SocketService;

  port: number = -1;
  private api: ContextBridge_UDP;
  private eventEmitter: EventEmitter = new EventEmitter();

  private constructor() {
    super();
    if(!apiBridge || !apiBridge.UDPRequests) {
      throw new Error("Electron Context Bridge API is not available.");
    }
    this.api = apiBridge.UDPRequests;
  }
  async openSocket(port: number): Promise<void> {
    const openedPort = await this.api.openUDPSocket(port);
    this.port = openedPort;
  }
  async closeSocket(): Promise<void> {
    await this.api.closeUDPSocket();
  }
  onSocketClosed(fn: () => void): EmitterSubscription {
    return this.eventEmitter.addListener(BaseSocketService.SocketEvents.SOCKET_CLOSED, fn);
  }
  onSocketError(fn: (error: Error) => void): EmitterSubscription {
    return this.eventEmitter.addListener(BaseSocketService.SocketEvents.SOCKET_ERROR, fn);
  }
  onPacket(fn: (packet: ITelemetryData) => void): EmitterSubscription {
    return this.eventEmitter.addListener(BaseSocketService.SocketEvents.PACKET, fn);
  }
  DEBUG(): void {
    throw new Error("Method not implemented.");
  }
  STOP_DEBUG(): void {
    throw new Error("Method not implemented.");
  }
  private async initialize() {
    await delay(100);
    this.api.onSocketClosed(() => {
      Logger.log(TAG, `UDP Socket closed event received`);
      this.eventEmitter.emit(BaseSocketService.SocketEvents.SOCKET_CLOSED);
    });
    this.api.onSocketError((error: Error) => {
      Logger.error(TAG, `UDP Socket error event received: ${error.message}`);
      this.eventEmitter.emit(BaseSocketService.SocketEvents.SOCKET_ERROR, error);
    });
    this.api.onSocketData((packet: ITelemetryData) => {
      Logger.log(TAG, `UDP Socket data event received: ${JSON.stringify(packet)}`);
      this.eventEmitter.emit(BaseSocketService.SocketEvents.PACKET, packet);
    });
  }
}

export default SocketService;