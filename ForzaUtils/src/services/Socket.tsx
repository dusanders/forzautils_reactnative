import { ForzaTelemetryApi, getRandomTelemetryData, ITelemetryData } from "ForzaTelemetryApi";
import React, { useContext } from "react";
import UdpSockets from "react-native-udp";
import UdpSocket from "react-native-udp/lib/types/UdpSocket";
import { ILogger } from "../context/Logger";
import { Upd_rinfo } from "../constants/types";

export interface ISocketCallback {
  onError(error: Error): void;
  onClose(ev: Error | unknown): void;
  onPacket(packet: ITelemetryData): void;
}

export interface ISocket {
  DEBUG(): void;
  STOP_DEBUG(): void;
  bind(port: number, callbacks: ISocketCallback): Promise<number>;
  close(): void;
}

export class Socket implements ISocket {
  private static instance: Socket | undefined;
  static getInstance(logger: ILogger) {
    if (!Socket.instance) {
      Socket.instance = new Socket(logger);
    }
    return Socket.instance;
  }
  private tag = "Socket.tsx";
  private udpSocket?: UdpSocket;
  private callbacks?: ISocketCallback;
  private logger: ILogger;
  private debugInterval?: NodeJS.Timeout;

  constructor(logger: ILogger) {
    this.logger = logger
  }

  bind(port: number, callbacks: ISocketCallback): Promise<number> {
    return new Promise((resolve, reject) => {
      // If we already have a socket...
      if (this.udpSocket) {
        // update the callbacks and return the current use port
        this.callbacks = callbacks;
        return resolve(this.udpSocket?.address().port || 0);
      }
      
      this.callbacks = callbacks;
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
    this.debugInterval = setInterval(() => {
      const randomPacket = getRandomTelemetryData();
      this.callbacks?.onPacket(randomPacket);
    }, 100);
  }
  STOP_DEBUG(): void {
    if(this.debugInterval) {
      clearInterval(this.debugInterval);
      this.debugInterval = undefined;
    }
  }
  private errorHandler(ev: Error | any) {
    this.callbacks?.onError(ev);
    try {
      this.udpSocket?.close();
      this.udpSocket = undefined
    } catch (e: unknown) {
      const err = e as Error;
      this.logger.error(this.tag, `Socket error: ${err?.message}`);
    }
  }
  private closeHandler(ev: Error | any) {
    this.callbacks?.onClose(ev);
    this.udpSocket = undefined;
    this.logger.error(this.tag, `Socket closed: ${ev?.message}`);
  }
  private dataHandler(data: Buffer, rinfo: Upd_rinfo) {
    const forzaPacket = ForzaTelemetryApi.parseData(rinfo.size, data);
    this.callbacks?.onPacket(forzaPacket);
  }
}