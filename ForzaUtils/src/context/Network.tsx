import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLogger } from './Logger';
import { addEventListener, NetInfoState, NetInfoStateType, NetInfoSubscription } from '@react-native-community/netinfo';
import { Splash } from '../pages/Splash';
import { delay, LISTEN_PORT } from '../constants/types';
import { ITelemetryData } from 'ForzaTelemetryApi';
import { ISocketCallback, Socket } from '../services/Socket';
import { ISession } from '../services/Database/DatabaseInterfaces';
import { useAtom } from 'jotai';
import { initialState, wifiState } from '../hooks/WifiState';
import { packetState } from '../hooks/PacketState';

//#region Definitions

export enum ReplayState {
  STOPPED = 'STOPPED',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED'
}

export interface INetworkContext {
  /**
   * Current replay session
   */
  replay?: ISession;
  /**
   * Delay in milliseconds between reading and sending replay packets
   */
  replayDelay: number;
  /**
   * Current replay state
   */
  replayState: ReplayState;
  /**
   * Set the replay state
   * @param state Replay state to set
   */
  setReplayState(state: ReplayState): void;
  /**
   * Time to wait between reading and sending replay packets
   * @param ms Time delay in MS
   */
  setReplayDelay(ms: number): void;
  /**
   * Start a debug stream of randomly generated telemetry packets
   */
  DEBUG(): void;
  /**
   * Stop the debug stream 
   */
  STOP_DEBUG(): void;
  /**
   * Set the replay session 
   * @param session Session to use for replay packets
   */
  setReplaySession(session?: ISession): void;
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
  const [currentWifiState, setNewWifiState] = useAtom(wifiState);
  const [currentPacket, setCurrentPacket] = useAtom(packetState);
  const [loaded, setLoaded] = useState(false);
  const [renderHack, setRenderHack] = useState(false);
  const replayState = useRef<ReplayState>(ReplayState.STOPPED);
  const replaySession = useRef<ISession | undefined>(undefined);
  const throttledPacket = useRef<ITelemetryData>(undefined);
  const animationFrameId = useRef<number | undefined>(undefined);
  const replayDelay = useRef<number>(100);

  /**
   * Handler for the Socket service instance
   */
  const socketCallbacks = useMemo<ISocketCallback>(() => ({
    onClose: (ev) => {
      logger.debug(tag, `socket did close ${(ev as Error)?.message}`);
      setNewWifiState({
        ...currentWifiState,
        port: 0
      });
    },
    onError: (ev) => {
      logger.error(tag, `Socket error: ${ev?.message}`);
      setNewWifiState({
        ...currentWifiState,
        port: 0
      });
    },
    onPacket: (packet) => {
      if (!replaySession.current) {
        throttledPacket.current = packet;
      }
    }
  }), []);

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
    if (replaySession.current && replayState.current === ReplayState.PLAYING) {
      throttledPacket.current = (await replaySession.current.readPacket()) || undefined;
      await delay(replayDelay.current);
    }
    if (throttledPacket.current) {
      setCurrentPacket({ packet: throttledPacket.current });
    }
    animationFrameId.current = requestAnimationFrame(() => { updatePacketState() });
  }

  /**
   * Gather and update the Wifi state
   */
  useEffect(() => {
    let netInfoSub: NetInfoSubscription = addEventListener((state: NetInfoState) => {
      if (!state || state.type !== NetInfoStateType.wifi) {
        setNewWifiState(initialState);
      } else if (state.type === NetInfoStateType.wifi && state.isConnected) {
        setNewWifiState((prev) => {
          return {
            isConnected: true,
            isUdpListening: prev.isUdpListening,
            port: prev.port,
            ip: state.details?.ipAddress || ""
          }
        });
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
    if (currentWifiState.isUdpListening) {
      logger.debug(tag, `Starting packet flush interval`);
      updatePacketState();
    } else {
      logger.debug(tag, `Stopping packet flush interval`);
      closeAnimationFrame();
    }
  }, [currentWifiState.isUdpListening]);

  /**
   * Handle Wifi connection state changes
   */
  useEffect(() => {
    let socket: Socket | undefined;
    const tryConnect = async () => {
      socket = Socket.getInstance(logger);
      let listeningPort = await socket.bind(LISTEN_PORT, socketCallbacks);
      setNewWifiState({
        isConnected: currentWifiState.isConnected,
        isUdpListening: listeningPort > 0,
        port: listeningPort,
        ip: currentWifiState.ip
      });
      setLoaded(true);
    }
    if (currentWifiState.isConnected) {
      logger.debug(tag, `Wifi connected!`);
      tryConnect();
    } else {
      logger.debug(tag, `Wifi disconnected!`);
      setNewWifiState(initialState);
      socket?.close()
    }
  }, [currentWifiState.isConnected]);

  return (
    <NetworkContext.Provider value={{
      replay: replaySession.current,
      replayDelay: replayDelay.current,
      replayState: replayState.current,
      setReplayState: (state) => {
        logger.debug(tag, `Setting replay state: ${replayState.current} -> ${state}`);
        replayState.current = state;
        setRenderHack(!renderHack);
      },
      setReplayDelay: (ms) => {
        replayDelay.current = ms;
      },
      setReplaySession: (session) => {
        replaySession.current = session;
        replayState.current = Boolean(session)
          ? ReplayState.PAUSED
          : ReplayState.STOPPED;
        if (!animationFrameId.current) {
          updatePacketState();
        }
        setRenderHack(!renderHack);
      },
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