import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLogger } from './Logger';
import { addEventListener, NetInfoState, NetInfoStateType, NetInfoSubscription, NetInfoWifiState } from '@react-native-community/netinfo';
import { useSetPacket, useSetPort, useSetUdpListening, useSetWifiState } from '../redux/WifiStore';
import { Splash } from '../pages/Splash';
import { LISTEN_PORT, Upd_rinfo } from '../constants/types';
import { ForzaTelemetryApi } from 'ForzaTelemetryApi';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';
import UdpSockets from 'react-native-udp';
import { ISocketCallback, Socket } from '../services/Socket';


export interface INetworkState {
  children?: any;
}

export function NetworkWatcher(props: INetworkState) {
  const tag = "NetworkWatcher.tsx";
  const logger = useLogger();
  const [port, setPort] = useState(0);
  const updateWifiState = useSetWifiState();
  const updatePacket = useSetPacket();
  const updatePort = useSetPort();
  const updateUdpListening = useSetUdpListening();
  const [wifiConnected, setWifiConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const throttledPacket = useRef<ForzaTelemetryApi>(undefined);
  const socketCallbacks = useMemo<ISocketCallback>(() => ({
    onClose: (ev) => { 
      logger.debug(tag, `socket did close ${(ev as Error)?.message}`);
      setPort(0);
     },
    onError: (ev) => { 
      logger.error(tag, `Socket error: ${ev?.message}`);
      setPort(0);
     },
    onPacket: (packet) => {
      throttledPacket.current = packet;
    }
  }), []);

  /**
   * Determine if the device is connected to a Wifi network
   * @param netInfo Network state object
   * @returns 
   */
  const isWifiConnected = (netInfo: NetInfoState | undefined) => {
    if (!netInfo) {
      logger.error(tag, `Failed to get NetInfo! ${JSON.stringify(netInfo)}`);
      return false
    };
    return netInfo.type === NetInfoStateType.wifi
      && netInfo.isConnected;
  }

  /**
   * Gather and update the Wifi state
   */
  useEffect(() => {
    let netInfoSub: NetInfoSubscription = addEventListener((state) => {
      updateWifiState({
        isConnected: isWifiConnected(state) || false,
        isUdpListening: false,
        port: 0,
        ip: (state.details as any)?.ipAddress || "",
      });
      setWifiConnected(isWifiConnected(state));
      setLoaded(true);
    });
    return () => {
      if (netInfoSub) {
        netInfoSub();
      }
    }
  }, []);

  /**
   * Throttle the packet data to avoid flooding the UI
   */
  useEffect(() => {
    const flush = setInterval(() => {
      if (throttledPacket.current) {
        updatePacket(throttledPacket.current);
      }
    }, 10);
    return () => {
      clearInterval(flush)
    }
  }, []);

  /**
   * Handle port changes - change redux UDP listening 
   */
  useEffect(() => {
    logger.debug(tag, `port update: ${port}`);
    if (port > 0) {
      updateUdpListening(true);
    } else {
      updateUdpListening(false);
    }
    updatePort(port);
  }, [port]);

  /**
   * Handle Wifi connection state changes
   */
  useEffect(() => {
    console.log(tag, `Wifi state changed! ${JSON.stringify(wifiConnected)}`);
    let socket: Socket | undefined;
    const tryConnect = async () => {
      socket = Socket.getInstance(logger);
      let listeningPort = await socket.bind(LISTEN_PORT, socketCallbacks);
      setPort(listeningPort);
    }
    if (wifiConnected) {
      tryConnect();
    } else {
      logger.debug(tag, `Wifi disconnected!`);
      socket?.close()
    }
    setLoaded(true);
    return () => {
      if (socket) {
        socket.close();
      }
    }
  }, [wifiConnected]);

  if (!loaded) return (<Splash />);
  return props.children;
}