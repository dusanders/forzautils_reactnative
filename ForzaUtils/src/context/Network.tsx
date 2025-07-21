import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLogger } from './Logger';
import { addEventListener, NetInfoState, NetInfoStateType, NetInfoSubscription } from '@react-native-community/netinfo';
import { Splash } from '../pages/Splash';
import { LISTEN_PORT } from '../constants/types';
import { ITelemetryData } from 'ForzaTelemetryApi';
import { ISocketCallback, Socket } from '../services/Socket';
import { wifiService } from '../hooks/WifiState';
import { packetService } from '../hooks/PacketState';
import { ReplayState, useReplay } from './Recorder';

//#region Definitions

export interface INetworkContext {
  /**
   * Start a debug stream of randomly generated telemetry packets
   */
  DEBUG(): void;
  /**
   * Stop the debug stream 
   */
  STOP_DEBUG(): void;
}

/**
 * Network context to provide network state and socket information
 */
export const NetworkContext = createContext({} as INetworkContext);

/**
 * Custom hook to access the network context
 * @returns Network context
 */
export function useNetworkContext() {
  return useContext(NetworkContext);
}

/**
 * Network watcher component to monitor network state and socket connections
 */
export interface NetworkWatcherProps {
  children?: any;
}

//#endregion

/**
 * Network watcher component
 * @param props Network watcher props
 * @returns 
 */
export function NetworkWatcher(props: NetworkWatcherProps) {
  const tag = "NetworkWatcher.tsx";
  const logger = useLogger();
  const wifiVm = wifiService();
  const packetVm = packetService();
  const replay = useReplay();
  const replayService = useReplay();
  const [loaded, setLoaded] = useState(false);
  const throttledPacket = useRef<ITelemetryData>(undefined);
  const animationFrameId = useRef<number | undefined>(undefined);

  /**
   * Handler for the Socket service instance
   */
  const socketCallbacks = useMemo<ISocketCallback>(() => ({
    onClose: (ev) => {
      logger.debug(tag, `socket did close ${(ev as Error)?.message}`);
      wifiVm.setWifi({
        ...wifiVm.wifi,
        port: 0
      })
    },
    onError: (ev) => {
      logger.error(tag, `Socket error: ${ev?.message}`);
      wifiVm.setWifi({
        ...wifiVm.wifi,
        port: 0
      });
    },
    onPacket: (packet) => {
      if (replayService.replayState !== ReplayState.PLAYING) {
        throttledPacket.current = packet;
      }
    }
  }), [replayService, replayService.replayState]);

  /**
   * Close the animation frame request
   */
  const closeAnimationFrame = () => {
    logger.log(tag, `closing animationFrame: ${animationFrameId.current}`);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    }
  }

  /**
   * Update the packet state with the latest throttled packet
   * This is called at a regular interval to avoid flooding the UI
   */
  const updatePacketState = async () => {
    if (throttledPacket.current) {
      packetVm.setPacket(throttledPacket.current);
    }
    animationFrameId.current = requestAnimationFrame(() => { updatePacketState() });
  }

  /**
   * Gather and update the Wifi state
   */
  useEffect(() => {
    let netInfoSub: NetInfoSubscription = addEventListener((state: NetInfoState) => {
      if (!state || state.type !== NetInfoStateType.wifi) {
        wifiVm.resetState();
      } else if (state.type === NetInfoStateType.wifi && state.isConnected) {
        wifiVm.setWifi({
          isConnected: true,
          ip: state.details?.ipAddress || '',
        })
      }
    });
    return () => {
      if (netInfoSub) {
        netInfoSub();
      }
      Socket.getInstance(logger).close();
      closeAnimationFrame();
    }
  }, []);

  /**
   * Throttle the packet data to avoid flooding the UI
   */
  useEffect(() => {
    if (wifiVm.wifi.isUdpListening) {
      logger.debug(tag, `Starting packet flush interval`);
      updatePacketState();
    } else {
      logger.debug(tag, `Stopping packet flush interval`);
      closeAnimationFrame();
    }
  }, [wifiVm.wifi.isUdpListening]);

  /**
   * Handle Wifi connection state changes
   */
  useEffect(() => {
    let socket: Socket | undefined;
    const tryConnect = async () => {
      socket = Socket.getInstance(logger);
      let listeningPort = await socket.bind(LISTEN_PORT, socketCallbacks);
      wifiVm.setWifi({
        isUdpListening: listeningPort > 0,
        port: listeningPort,
      });
      setLoaded(true);
    }
    if (wifiVm.wifi.isConnected) {
      logger.debug(tag, `Wifi connected!`);
      tryConnect();
    } else {
      logger.debug(tag, `Wifi disconnected!`);
      wifiVm.resetState();
      socket?.close()
    }
  }, [wifiVm.wifi.isConnected]);

  useEffect(() => {
    if(replay.replayState === ReplayState.PLAYING){
      // Handle replay playing state
      if (replay.replayPacket) {
        packetVm.setPacket(replay.replayPacket);
      }
      animationFrameId.current = requestAnimationFrame(() => { updatePacketState() });
    }
  }, [replay.replayState, replay.replayPacket, packetVm]);

  return (
    <NetworkContext.Provider value={{
      DEBUG: () => {
        Socket.getInstance(logger).DEBUG();
      },
      STOP_DEBUG: () => {
        Socket.getInstance(logger).STOP_DEBUG();
      }
    }}>
      {loaded && props.children}
      {!loaded && (<Splash />)}
    </NetworkContext.Provider>
  );
}