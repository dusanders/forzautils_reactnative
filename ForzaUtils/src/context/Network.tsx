import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLogger } from './Logger';
import { Splash } from '../pages/Splash';
import { LISTEN_PORT } from '../types/types';
import { ITelemetryData } from 'ForzaTelemetryApi';
import { Socket } from '../services/Socket';
import { ReplayState, useReplay } from './Recorder';
import EventEmitter, { EmitterSubscription } from 'react-native/Libraries/vendor/emitter/EventEmitter';
import { useWifi } from './Wifi';

//#region Definitions

export interface INetworkContext {
  isUDPListening: boolean;
  port: number;
  isDEBUG: boolean;
  lastPacket?: ITelemetryData;
  onPacket(fn: (packet: ITelemetryData) => void): EmitterSubscription;
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

const PACKET_EVENT = 'packet';
/**
 * Network watcher component
 * @param props Network watcher props
 * @returns 
 */
export function NetworkWatcher(props: NetworkWatcherProps) {
  const tag = "NetworkWatcher.tsx";
  const logger = useLogger();
  const replay = useReplay();
  const wifi = useWifi();
  const [isUDPListening, setIsUDPListening] = useState(false);
  const [port, setPort] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isDEBUG, setIsDEBUG] = useState(false);
  const eventEmitter = useRef<EventEmitter>(new EventEmitter());
  const throttledPacket = useRef<ITelemetryData>(undefined);
  const closeSocketEventSub = useRef<EmitterSubscription>(undefined);
  const errorSocketEventSub = useRef<EmitterSubscription>(undefined);
  const packetSocketEventSub = useRef<EmitterSubscription>(undefined);
  const socketRef = useRef<Socket>(undefined);

  const onNewPacket = (packet: ITelemetryData) => {
    throttledPacket.current = packet;
    eventEmitter.current.emit(PACKET_EVENT, packet);
    replay.recordPacket(packet).catch((e) => {
      logger.error(tag, `Error recording packet: ${e?.message}`);
    });
  };

  /**
   * Handle Wifi connection state changes
   */
  useEffect(() => {
    const tryConnect = async () => {
      let listeningPort = await socketRef.current?.bind(LISTEN_PORT);
      setIsUDPListening(listeningPort !== undefined && listeningPort > 0);
      setPort(listeningPort || 0);
      setLoaded(true);
    }
    if (wifi.isWifi) {
      socketRef.current = Socket.getInstance(logger);
      closeSocketEventSub.current = socketRef.current.onCloseEvent((ev) => {
        logger.debug(tag, `socket did close ${(ev as Error)?.message}`);
        setIsUDPListening(false);
        setPort(0);
      })
      errorSocketEventSub.current = socketRef.current.onErrorEvent((ev) => {
        logger.error(tag, `Socket error: ${ev?.message}`);
        setIsUDPListening(false);
        setPort(0);
      });
      packetSocketEventSub.current = socketRef.current.onPacketEvent((packet) => {
        onNewPacket(packet);
      });
      logger.debug(tag, `Wifi connected!`);
      tryConnect();
    } else {
      logger.debug(tag, `Wifi disconnected!`);
      setPort(0);
      setIsUDPListening(false);
      socketRef.current?.close();
      socketRef.current = undefined;
    }
    return () => {
      closeSocketEventSub.current?.remove();
      errorSocketEventSub.current?.remove();
      packetSocketEventSub.current?.remove();
      socketRef.current = undefined;
    }
  }, [wifi.isWifi]);

  useEffect(() => {
    if (isDEBUG && replay.replayState === ReplayState.PLAYING) {
      logger.log(tag, `Disabling DEBUG mode due to playback state`);
      setIsDEBUG(false);
      Socket.getInstance(logger).STOP_DEBUG();
    }
  }, [replay.replayState]);

  return (
    <NetworkContext.Provider value={{
      isUDPListening: isUDPListening,
      port: port,
      isDEBUG: isDEBUG,
      lastPacket: throttledPacket.current,
      onPacket: (fn: (packet: ITelemetryData) => void): EmitterSubscription => {
        return eventEmitter.current.addListener(PACKET_EVENT, fn);
      },
      DEBUG: () => {
        logger.log(tag, 'Starting DEBUG mode');
        setIsDEBUG(true);
        Socket.getInstance(logger).DEBUG();
      },
      STOP_DEBUG: () => {
        logger.log(tag, 'Stopping DEBUG mode');
        setIsDEBUG(false);
        Socket.getInstance(logger).STOP_DEBUG();
      }
    }}>
      {!loaded && (<Splash />)}
      {loaded && props.children}
    </NetworkContext.Provider>
  );
}