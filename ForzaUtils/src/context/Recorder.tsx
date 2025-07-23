import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { DatabaseService } from "../services/Database/Database";
import { useLogger } from "./Logger";
import { ISessionInfo, ISession } from "../services/Database/DatabaseInterfaces";
import { ITelemetryData } from "ForzaTelemetryApi";
import { packetService } from "../hooks/PacketState";


export enum ReplayState {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  RECORDING = 'RECORDING',
  IDLE = 'IDLE',
}

export interface IRecorder {
  replayState: ReplayState;
  replayInfo?: ISessionInfo;
  replayDelay: number;
  replayPosition: number;
  replayLength: number;
  setReplayDelay(ms: number): void;
  pause(): void;
  restart(): void;
  resume(): void;
  closeReplay(): void;
  loadReplay(session: ISessionInfo): void;
  getAllSessions(): Promise<ISessionInfo[]>;
  closeRecording(): void;
  startRecording(): void;
  delete(info: ISessionInfo): Promise<void>;
}

export interface RecorderProviderProps {
  children?: any;
}

export const RecorderContext = createContext({} as IRecorder);
// Add controls-only context
export const ReplayControlsContext = createContext({} as Pick<IRecorder, 'replayInfo' | 'replayState' | 'replayDelay' | 'startRecording' | 'closeRecording'>);

export function useReplay() {
  return useContext(RecorderContext);
}
export function useReplayControls() {
  return useContext(ReplayControlsContext);
}

export function RecorderProvider(props: RecorderProviderProps) {
  const tag = 'RecorderProvider.tsx';
  let replayInterval: NodeJS.Timeout | undefined = undefined;
  const logger = useLogger();
  const forzaPacket = packetService();
  const dbService = useRef(DatabaseService.getInstance());
  const currentFile = useRef<ISession>(undefined);
  const [replayState, setReplayState] = useState<ReplayState>(ReplayState.PAUSED);
  const [replayDelay, setReplayDelay] = useState<number>(1000 / 24); // 24 FPS
  const [replayPosition, setReplayPosition] = useState<number>(0);
  const [replayLength, setReplayLength] = useState<number>(0);

  const getAllInfos = useCallback(async () => {
    const rows = await dbService.current.getAllSessions();
    return rows;
  }, []);

  const initRecording = useCallback(async () => {
    if (currentFile.current) {
      return currentFile.current;
    }
    let session = await dbService.current.generateSession();
    currentFile.current = session;
    setReplayState(ReplayState.RECORDING);
    return session;
  }, []);

  const loadReplay = useCallback(async (session: ISessionInfo) => {
    if (currentFile.current) {
      currentFile.current.close();
      currentFile.current = undefined;
    }
    const file = await dbService.current.getSessionByName(session.name);
    if (!file) {
      logger.error(tag, `No session found for ${session.name}`);
      return;
    }
    currentFile.current = file;
    setReplayState(ReplayState.PAUSED);
    setReplayPosition(0);
    setReplayLength(file.info.length);
    logger.log(tag, `Loaded replay: ${file.info.name}`);
  }, [logger]);

  const deleteReplay = useCallback(async (info: ISessionInfo) => {
    await dbService.current.deleteSession(info.name);
  }, []);

  const closeRecording = useCallback(() => {
    if (currentFile.current) {
      currentFile.current.close();
      currentFile.current = undefined;
    }
    setReplayState(ReplayState.PAUSED);
  }, []);

  const resume = useCallback(() => {
    if (currentFile.current) {
      setReplayState(ReplayState.PLAYING);
      setReplayPosition(currentFile.current.currentReadOffset);
    }
  }, []);

  const restart = useCallback(() => {
    if (currentFile.current) {
      loadReplay(currentFile.current.info);
    }
  }, [loadReplay]);

  const pause = useCallback(() => {
    if (currentFile.current) {
      setReplayState(ReplayState.PAUSED);
    }
  }, []);

  const closeReplay = useCallback(() => {
    if (currentFile.current) {
      currentFile.current.close();
      currentFile.current = undefined;
    }
    setReplayState(ReplayState.PAUSED);
    forzaPacket.setPacket(undefined);
    setReplayPosition(0);
    setReplayLength(0);
  }, []);

  const play = () => {
    if (replayInterval) {
      clearInterval(replayInterval);
    }
    replayInterval = setInterval(async () => {
      if (currentFile.current) {
        const packet = (await currentFile.current.readPacket()) || undefined;
        if (packet) {
          forzaPacket.setPacket(packet);
          setReplayPosition(currentFile.current.currentReadOffset);
        } else {
          logger.log(tag, `No more packets to read, stopping replay`);
          setReplayState(ReplayState.PAUSED);
        }
      }
    }, replayDelay);
  }

  useEffect(() => {
    const getAll = async () => {
      const records = await dbService.current.getAllSessions();
      logger.log(tag, `records: ${JSON.stringify(records)}`);
    }
    getAll();
  }, []);

  useEffect(() => {
    if (currentFile.current && replayState === ReplayState.RECORDING && forzaPacket.packet) {
      currentFile.current.addPacket(forzaPacket.packet)
    }
  }, [currentFile.current, forzaPacket.packet, replayState]);

  useEffect(() => {
    if (replayState === ReplayState.PLAYING) {
      play();
    } else if (replayInterval) {
      clearInterval(replayInterval);
    }
    return () => clearInterval(replayInterval);
  }, [currentFile.current, replayDelay, replayState]);

  // full context value
  const recorderValue = useMemo(() => ({
    replayInfo: currentFile.current?.info,
    replayPosition,
    replayLength,
    replayState: currentFile.current ? replayState : ReplayState.IDLE,
    replayDelay,
    setReplayDelay,
    pause,
    restart,
    resume,
    loadReplay,
    getAllSessions: getAllInfos,
    delete: deleteReplay,
    startRecording: initRecording,
    closeRecording,
    closeReplay,
  }), [
    currentFile.current?.info,
    replayPosition,
    replayLength,
    replayState,
    replayDelay,
    setReplayDelay,
    pause,
    restart,
    resume,
    loadReplay,
    getAllInfos,
    deleteReplay,
    initRecording,
    closeRecording,
    closeReplay,
  ]);

  // controls-only value
  const controlsValue = useMemo(() => ({
    replayInfo: recorderValue.replayInfo,
    replayState: recorderValue.replayState,
    replayDelay: recorderValue.replayDelay,
    startRecording: recorderValue.startRecording,
    closeRecording: recorderValue.closeRecording,
  }), [
    recorderValue.replayInfo,
    recorderValue.replayState,
    recorderValue.replayDelay,
    recorderValue.startRecording,
    recorderValue.closeRecording,
  ]);

  return (
    <RecorderContext.Provider value={recorderValue}>
      <ReplayControlsContext.Provider value={controlsValue}>
        {props.children}
      </ReplayControlsContext.Provider>
    </RecorderContext.Provider>
  );
}