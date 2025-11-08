import { ForzaTelemetryApi, getRandomTelemetryData, ITelemetryData } from "ForzaTelemetryApi";
import UdpSockets from "react-native-udp";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import { ILogger } from "../context/Logger";
import { Upd_rinfo } from "../types/types";
import EventEmitter, { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";

export enum SocketEventType {
  ERROR = "error",
  CLOSE = "close",
  PACKET = "packet"
}

export interface ISocket {
  onErrorEvent(fn: (error: Error) => void): EmitterSubscription;
  onCloseEvent(fn: (ev: Error | unknown) => void): EmitterSubscription;
  onPacketEvent(fn: (packet: ITelemetryData) => void): EmitterSubscription;
  DEBUG(): void;
  STOP_DEBUG(): void;
  bind(port: number): Promise<number>;
  close(): void;
}

export class Socket implements ISocket {
  private static instance: Socket | undefined;
  private static DEBUG_INTERVAL_MS = 20;
  static getInstance(logger: ILogger) {
    if (!Socket.instance) {
      Socket.instance = new Socket(logger);
    }
    return Socket.instance;
  }
  private tag = "Socket.tsx";
  private udpSocket?: UdpSocket;
  private eventEmitter: EventEmitter = new EventEmitter();
  private logger: ILogger;
  private debugInterval?: NodeJS.Timeout;
  private doDebug = false;

  constructor(logger: ILogger) {
    this.logger = logger
  }

  onErrorEvent(fn: (error: Error) => void): EmitterSubscription {
    return this.eventEmitter.addListener(SocketEventType.ERROR, fn);
  }
  onCloseEvent(fn: (ev: Error | unknown) => void): EmitterSubscription {
    return this.eventEmitter.addListener(SocketEventType.CLOSE, fn);
  }
  onPacketEvent(fn: (packet: ITelemetryData) => void): EmitterSubscription {
    return this.eventEmitter.addListener(SocketEventType.PACKET, fn);
  }

  bind(port: number): Promise<number> {
    return new Promise((resolve, reject) => {
      // If we already have a socket...
      if (this.udpSocket) {
        return resolve(this.udpSocket?.address().port || 0);
      }
      
      const bindErrorHandler = (e: Error | any) => {
        this.udpSocket = undefined;
        reject(new Error(`Failed to bind: ${e?.message}`));
      }
      const bindCloseHandler = (e: Error | any) => {
        this.udpSocket = undefined;
        reject(new Error(`Socket closed during bind: ${e?.message}`));
      }
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
          this.logger.debug(this.tag, `Socket is undefined at listening event`);
          reject(new Error('Socket instance is undefined on listening event!!'));
        }
      }
      this.udpSocket = UdpSockets.createSocket({
        type: 'udp4',
        reusePort: true
      }).once('error', bindErrorHandler.bind(this))
        .once('close', bindCloseHandler.bind(this))
        .once('listening', bindListeningHandler.bind(this));
      this.udpSocket.bind(port)
    });
  }
  close(): void {
    this.udpSocket?.removeAllListeners();
    this.udpSocket?.close();
    this.udpSocket = undefined;
  }
  DEBUG(): void {
    this.doDebug = true;
    this.debugInterval = setTimeout(() => {
      const randomPacket = getRandomTelemetryData();
      this.eventEmitter.emit(SocketEventType.PACKET, randomPacket);
      if (this.doDebug) {
        this.DEBUG();
      }
    }, Socket.DEBUG_INTERVAL_MS);
  }
  STOP_DEBUG(): void {
    this.doDebug = false;
    if (this.debugInterval) {
      clearTimeout(this.debugInterval);
      this.debugInterval = undefined;
    }
  }
  private errorHandler(ev: Error | any) {
    this.eventEmitter.emit(SocketEventType.ERROR, ev);
    try {
      this.udpSocket?.close();
      this.udpSocket = undefined
    } catch (e: unknown) {
      const err = e as Error;
      this.logger.error(this.tag, `Socket error: ${err?.message}`);
    }
  }
  private closeHandler(ev: Error | any) {
    this.eventEmitter.emit(SocketEventType.CLOSE, ev);
    this.udpSocket = undefined;
    this.logger.error(this.tag, `Socket closed: ${ev?.message}`);
  }
  private dataHandler(data: Buffer, rinfo: Upd_rinfo) {
    const forzaPacket = ForzaTelemetryApi.parseData(rinfo.size, data);
    this.eventEmitter.emit(SocketEventType.PACKET, forzaPacket);
  }
}