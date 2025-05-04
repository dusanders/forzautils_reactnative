import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLogger } from './Logger';
import { addEventListener, NetInfoState, NetInfoStateType, NetInfoSubscription } from '@react-native-community/netinfo';
import { getWifiState, useSetPacket, useSetWifiState } from '../redux/WifiStore';
import { Splash } from '../pages/Splash';
import { delay, LISTEN_PORT } from '../constants/types';
import { ITelemetryData } from 'ForzaTelemetryApi';
import { ISocketCallback, Socket } from '../services/Socket';
import { useSelector } from 'react-redux';
import { ISession } from '../services/Database/DatabaseInterfaces';

export interface INetworkContext {
  replay?: ISession;
  setReplaySession(session?: ISession): void;
}

export const NetworkContext = createContext({} as INetworkContext);

export function useNetworkContext() {
  return useContext(NetworkContext);
}

export interface NetworkWatcherProps {
  children?: any;
}

export function NetworkWatcher(props: NetworkWatcherProps) {
  const tag = "NetworkWatcher.tsx";
  const logger = useLogger();
  const [port, setPort] = useState(0);
  const updateReduxWifiState = useSetWifiState();
  const reduxWifiState = useSelector(getWifiState);
  const updatePacket = useSetPacket();
  const [loaded, setLoaded] = useState(false);
  const [wifiInfo, setWifiInfo] = useState<NetInfoState | undefined>(undefined);
  const [isReplay, setIsReplay] = useState(false);
  const replaySession = useRef<ISession | undefined>(undefined);
  const throttledPacket = useRef<ITelemetryData>(undefined);
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
      if (!replaySession.current) {
        throttledPacket.current = packet;
      }
    }
  }), []);

  const netInfoCallback = useCallback((state: NetInfoState) => {
    setWifiInfo((prevWifiInfo) => {
      if (state.type !== prevWifiInfo?.type || state.isConnected !== prevWifiInfo?.isConnected) {
        return state; // Update the state only if it has changed
      }
      return prevWifiInfo; // Keep the previous state if nothing has changed
    });
    setLoaded(true);
  }, []);

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
    if (replaySession.current) {
      throttledPacket.current = (await replaySession.current.readPacket()) || undefined;
      logger.log(tag, `use replay: ${throttledPacket.current?.timeStampMS}`);
      await delay(2000);
    }
    if (throttledPacket.current) {
      updatePacket(throttledPacket.current);
    }
    animationFrameId.current = requestAnimationFrame(updatePacketState);
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
    let netInfoSub: NetInfoSubscription = addEventListener(netInfoCallback);
    return () => {
      if (netInfoSub) {
        netInfoSub();
      }
      closeAnimationFrame();
    }
  }, []);

  /**
   * Throttle the packet data to avoid flooding the UI
   */
  useEffect(() => {
    if (reduxWifiState.isUdpListening) {
      logger.debug(tag, `Starting packet flush interval`);
      animationFrameId.current = requestAnimationFrame(updatePacketState);
    } else {
      logger.debug(tag, `Stopping packet flush interval`);
      closeAnimationFrame();
    }
    return () => {
      logger.log(tag, `effect return on UDP listener!!!`);
      closeAnimationFrame();
    }
  }, [reduxWifiState.isUdpListening]);

  /**
   * Handle Wifi connection state changes
   */
  useEffect(() => {
    let socket: Socket | undefined;
    const tryConnect = async () => {
      socket = Socket.getInstance(logger);
      let listeningPort = await socket.bind(LISTEN_PORT, socketCallbacks);
      updateReduxWifiState({
        ip: (wifiInfo?.details as any).ipAddress,
        port: listeningPort,
        isConnected: isWifiConnected(wifiInfo),
        isUdpListening: listeningPort > 0
      })
    }
    if (wifiInfo?.isConnected) {
      tryConnect();
    } else {
      logger.debug(tag, `Wifi disconnected!`);
      socket?.close()
    }
    setLoaded(true);
    return () => {
      logger.log(tag, `useEffect returns isConnected!!!`);
      if (socket) {
        socket.close();
      }
      closeAnimationFrame();
    }
  }, [wifiInfo?.isConnected]);

  useEffect(() => {
    if (wifiInfo && wifiInfo.isConnected) {
      updateReduxWifiState({
        ip: (wifiInfo.details as any).ipAddress,
        port: port,
        isConnected: isWifiConnected(wifiInfo),
        isUdpListening: port > 0
      });
    }
  }, [wifiInfo]);

  useEffect(() => {
    logger.log(tag, `setting replay session: ${replaySession.current?.info.name} : ${animationFrameId.current}`);
    if(isReplay) {
      updatePacketState();
    }
  }, [isReplay]);

  return (
    <NetworkContext.Provider value={{
      replay: replaySession.current,
      setReplaySession: (session) => {
        replaySession.current = session;
        setIsReplay(Boolean(session));
      }
    }}>
      {loaded && props.children}
      {!loaded && (<Splash />)}
    </NetworkContext.Provider>
  );
}