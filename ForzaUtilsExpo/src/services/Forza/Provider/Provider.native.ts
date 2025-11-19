import EventEmitter, { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";
import { INativeUDPService } from "../Network.types";
import { ForzaTelemetryApi, getRandomTelemetryData, ITelemetryData } from "shared";
import UdpSockets from "react-native-udp";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import { delay } from "@/helpers/misc";
import { Logger } from "@/hooks/Logger";
import BaseSocketService from "./BaseSocketService";
import { Semaphore } from "@/helpers/Semaphore";

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

const TAG = "Provider.native.ts[SocketService]";

class SocketService extends BaseSocketService {
  //#region Static Methods and Properties (inherited from BaseSocketService, but Initialize is overridden)

  static async Initialize(): Promise<INativeUDPService> {
    if (!BaseSocketService.instance) {
      BaseSocketService.instance = new SocketService();
      await (BaseSocketService.instance as SocketService).initialize();
    }
    return BaseSocketService.instance;
  }

  //#endregion

  private eventEmitter: EventEmitter = new EventEmitter();
  private udpSocket?: UdpSocket;
  private doDebug = false;
  private debugInterval?: NodeJS.Timeout;
  private bindSemaphore: Semaphore = new Semaphore(1);

  private constructor() {
    super();
    Logger.log(TAG, "Initializing SocketService instance");
  }

  async openSocket(port: number): Promise<void> {
    await this.bindSemaphore.acquire();
    let boundPort = -1;
    try {
      boundPort = await this.bind(port);
    } catch (e) {
      throw e;
    } finally {
      this.port = boundPort;
      this.bindSemaphore.release();
    }
  }

  async closeSocket(): Promise<void> {
    await this.bindSemaphore.acquire();
    Logger.log(TAG, "Closing socket");
    if (this.udpSocket) {
      this.udpSocket.removeAllListeners();
      this.udpSocket.close();
      this.udpSocket = undefined;
    }
    this.doDebug = false;
    if (this.debugInterval) {
      clearInterval(this.debugInterval);
    }
    this.eventEmitter.removeAllListeners();
    this.port = -1;
    this.bindSemaphore.release();
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

  DEBUG(interval_ms: number): void {
    if (this.doDebug) {
      Logger.log(TAG, "DEBUG already running.");
      return;
    }
    this.doDebug = true;
    Logger.log(TAG, "Started debugging.");
    this.debugInterval = setInterval(() => {
      if (!this.doDebug) {
        clearInterval(this.debugInterval);
        return;
      }
      const sampleData = getRandomTelemetryData();
      this.eventEmitter.emit(BaseSocketService.SocketEvents.PACKET, sampleData);
    }, interval_ms);
  }

  STOP_DEBUG(): void {
    this.doDebug = false;
    Logger.log(TAG, "Stopped debugging.");
  }

  private async initialize() {
    await delay(100);
  }

  private bind(port: number): Promise<number> {
    return new Promise((resolve, reject) => {
      let errorOccurred = false;
      if (this.udpSocket && this.udpSocket.address().port > 0) {
        Logger.log(TAG, `Socket already bound, returning existing port ${this.udpSocket.address().port}`);
        return resolve(this.udpSocket.address().port);
      }
      try {
        this.udpSocket = UdpSockets.createSocket(
          { type: 'udp4', reusePort: true },
        ).once('error', (error) => {
          errorOccurred = true;
          reject(new Error(`Socket error during bind: ${error?.message}`));
          this.udpSocket?.removeAllListeners();
          this.udpSocket?.close();
          this.udpSocket = undefined;
        }).once('listening', () => {
          if (errorOccurred) {
            return;
          }
          this.udpSocket?.removeAllListeners('error');
          this.udpSocket?.addListener('error', this.errorHandler.bind(this));
          this.udpSocket?.addListener('close', this.closeHandler.bind(this));
          this.udpSocket?.addListener('message', this.dataHandler.bind(this));
          resolve(port);
        });
        this.udpSocket.bind(port);
      } catch (e) {
        return reject(new Error(`Failed to bind socket: ${(e as Error).message}`));
      }
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