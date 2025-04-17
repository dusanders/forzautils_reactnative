import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLogger } from './Logger';
import { addEventListener, NetInfoState, NetInfoStateType, NetInfoSubscription } from '@react-native-community/netinfo';
import { useSetPort, useSetUdpListening, useSetWifiState } from '../redux/WifiStore';
import { Splash } from '../pages/Splash';
import { LISTEN_PORT } from '../constants/types';
import { ForzaTelemetryApi } from 'ForzaTelemetryApi';
import { ISocketCallback, Socket } from '../services/Socket';

export interface IForzaPacketEvent {
  packet: ForzaTelemetryApi | undefined;
}
export const ForzaPacketContext = React.createContext<IForzaPacketEvent>({} as IForzaPacketEvent);

export interface INetworkState {
  children?: any;
}

export function NetworkWatcher(props: INetworkState) {
  const tag = "NetworkWatcher.tsx";
  const logger = useLogger();
  const [port, setPort] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const updateWifiState = useSetWifiState();
  const updatePort = useSetPort();
  const updateUdpListening = useSetUdpListening();
  const [wifiConnected, setWifiConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [forzaPacket, setForzaPacket] = useState<ForzaTelemetryApi | undefined>(undefined);
  const throttledPacket = useRef<ForzaTelemetryApi>(undefined);
  const animationFrameId = useRef<number | undefined>(undefined);

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
   * Update the packet state with the latest throttled packet
   * This is called at a regular interval to avoid flooding the UI
   */
  const updatePacketState = () => {
    if (throttledPacket.current) {
      // console.log(tag, `Flushing packet: ${JSON.stringify(throttledPacket.current)}`);
      setForzaPacket(throttledPacket.current);
    }
  }

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
    updateUdpListening(isListening);
    if (isListening) {
      logger.debug(tag, `Starting packet flush interval`);
      animationFrameId.current = requestAnimationFrame(updatePacketState);
    } else {
      logger.debug(tag, `Stopping packet flush interval`);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = undefined;
      }
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = undefined;
      }
    }
  }, [isListening]);

  /**
   * Handle port changes - change redux UDP listening 
   */
  useEffect(() => {
    logger.debug(tag, `port update: ${port}`);
    setIsListening(port > 0);
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
  return (
    <ForzaPacketContext.Provider value={{
      packet: forzaPacket
    }}>
      {props.children}
    </ForzaPacketContext.Provider>
  )
}