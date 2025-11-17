import EventEmitter, { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";
import { INetworkService, Udp_rinfo } from "../Network.types";
import { ForzaTelemetryApi, ITelemetryData } from "shared";
import UdpSockets from "react-native-udp";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import { delay } from "@/helpers/misc";
import { Logger } from "@/hooks/Logger";
import BaseSocketService from "./BaseSocketService";

const TAG = "Provider.native.ts[SocketService]";

class SocketService extends BaseSocketService {
  //#region Static Methods and Properties (inherited from BaseSocketService, but Initialize is overridden)

  static async Initialize(): Promise<INetworkService> {
    if (!BaseSocketService.instance) {
      BaseSocketService.instance = new SocketService();
      await (BaseSocketService.instance as SocketService).initialize();
    }
    return BaseSocketService.instance;
  }

  //#endregion

  private eventEmitter: EventEmitter = new EventEmitter();
  private udpSocket?: UdpSocket;

  private constructor() {
    super();
  }

  async openSocket(port: number): Promise<void> {
    const openedPort = await this.bindSocket(port);
    this.port = openedPort;
  }

  async closeSocket(): Promise<void> {
    this.port = 0;
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
    console.log("Debugging...");
  }

  STOP_DEBUG(): void {
    console.log("Stopped debugging.");
  }

  private async initialize() {
    await delay(100);
  }

  private bindSocket(port: number): Promise<number> {
    return new Promise((resolve, reject) => {
      // If we already have a socket...
      if (this.udpSocket) {
        Logger.log(TAG, `Socket already bound, returning existing port ${this.udpSocket?.address().port || 0}`);
        return resolve(this.udpSocket?.address().port || 0);
      }

      const bindErrorHandler = (e: Error | any) => {
        this.udpSocket = undefined;
        reject(new Error(`Failed to bind: ${e?.message}`));
      };
      const bindCloseHandler = (e: Error | any) => {
        this.udpSocket = undefined;
        reject(new Error(`Socket closed during bind: ${e?.message}`));
      };
      const bindListeningHandler = () => {
        if (this.udpSocket) {
          this.udpSocket
            .removeListener('error', bindErrorHandler)
            .removeListener('close', bindCloseHandler)
            .removeListener('listening', bindListeningHandler)
            .addListener('error', this.errorHandler.bind(this))
            .addListener('close', this.closeHandler.bind(this))
            .addListener('message', this.dataHandler.bind(this));
          resolve(port);
        } else {
          Logger.log(TAG, `Socket is undefined at listening event`);
          reject(new Error('Socket instance is undefined on listening event!!'));
        }
      };

      this.udpSocket = UdpSockets.createSocket(
        { type: 'udp4', reusePort: true },
      ).once('error', bindErrorHandler.bind(this))
        .once('close', bindCloseHandler.bind(this))
        .once('listening', bindListeningHandler.bind(this));
      this.udpSocket.bind(port);
    });
  }

  private errorHandler(ev: Error | any) {
    this.eventEmitter.emit(BaseSocketService.SocketEvents.SOCKET_ERROR, ev);
    try {
      this.udpSocket?.close();
      this.udpSocket = undefined;
      this.port = -1;
    } catch (e: unknown) {
      const err = e as Error;
      Logger.error(TAG, `Socket error: ${err?.message}`);
    }
  }

  private closeHandler(ev: Error | any) {
    this.eventEmitter.emit(BaseSocketService.SocketEvents.SOCKET_CLOSED, ev);
    this.udpSocket = undefined;
    this.port = -1;
    Logger.error(TAG, `Socket closed: ${ev?.message}`);
  }

  private dataHandler(data: Buffer, rinfo: Udp_rinfo) {
    const forzaPacket = ForzaTelemetryApi.parseData(rinfo.size, data);
    this.eventEmitter.emit(BaseSocketService.SocketEvents.PACKET, forzaPacket);
  }
}

export default SocketService;