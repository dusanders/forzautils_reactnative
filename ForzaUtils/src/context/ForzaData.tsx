import { NetInfoState, NetInfoWifiState } from "@react-native-community/netinfo";
import { ForzaTelemetryApi } from "ForzaTelemetryApi";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useLogger } from "./Logger";
import UdpSockets from "react-native-udp";

/**
 * Add Type for react-native-udp 'rinfo' object
 */
interface Upd_rinfo {
  address: string,
  port: number,
  family: 'IPv4',
  size: number,
  ts: number,
}

export interface ForzaData {
  port: number;
  ip: string;
  ssid: string;
  packet: ForzaTelemetryApi | undefined;
}

export const ForzaContext = createContext({} as ForzaData);

export interface ForzaDataProviderProps {
  netInfo: NetInfoState;
  children?: any;
}

export function ForzaDataProvider(props: ForzaDataProviderProps) {
  const tag = 'ForzaDataProvider';
  const logger = useLogger();
  const [port, setPort] = useState(5200);
  const inetInfo = props.netInfo as NetInfoWifiState;
  const [packet, setPacket] = useState<ForzaTelemetryApi | undefined>(undefined);

  const bindErrorCallback = useCallback(() => {
    logger.error(tag, `Failed to bind port!`);
  }, []);

  const udpSocketError = useCallback((error: Error) => {
    logger.error(tag, `Socket error`)
  }, []);

  const dataHandler = useCallback((data: Buffer, rinfo: Upd_rinfo) => {
    // logger.debug(tag, `msg: ${data.toString()}`);
    const packet = new ForzaTelemetryApi(rinfo.size, data);
    setPacket(packet)
  }, []);

  const closeHandler = useCallback(() => {
    logger.warn(tag, `socket did close`);
  }, []);

  useEffect(() => {
    const socket = UdpSockets.createSocket({
      type: 'udp4',
      reusePort: true
    })
      .once('error', () => bindErrorCallback)
      .once('close', closeHandler)
      .once('listening', () => {
        logger.debug(tag, `socket opened @ ${JSON.stringify(socket.address())}`);
        socket.removeListener('error', bindErrorCallback)
          .addListener('error', udpSocketError)
          .addListener('message', dataHandler);
        setPort(socket.address().port);
      });
    socket.bind(port);

    return () => {
      if (socket) {
        socket.close(() => {
          logger.warn(tag, 'socket did close from close() call');
        })
      }
    }
  }, []);

  return (
    <ForzaContext.Provider value={{
      port: port,
      ip: inetInfo.details.ipAddress || '-',
      ssid: inetInfo.details.ssid || '-',
      packet: packet
    }}>
      {props.children}
    </ForzaContext.Provider>
  )
}