import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { DatabaseService } from "../services/Database/Database";
import { useLogger } from "./Logger";
import { ISessionInfo, ISession } from "../services/Database/DatabaseInterfaces";
import { ITelemetryData } from "ForzaTelemetryApi";
import EventEmitter, { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";


export enum ReplayState {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  RECORDING = 'RECORDING',
  IDLE = 'IDLE',
}

export interface IRecorder {
  recordPacket(packet: ITelemetryData): Promise<void>;
  onPacket(fn: (packet: ITelemetryData, position: number) => void): EmitterSubscription;
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
  seek(position: number): void;
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
const PACKET_EVENT = 'packet';
export function RecorderProvider(props: RecorderProviderProps) {
  const tag = 'RecorderProvider.tsx';
  let replayInterval: NodeJS.Timeout | undefined = undefined;
  const logger = useLogger();
  const dbService = useRef(DatabaseService.getInstance());
  const eventEmitter = useRef<EventEmitter>(new EventEmitter());
  const currentRecordingFile = useRef<ISession>(undefined);
  const currentFile = useRef<ISession>(undefined);
  const [replayState, setReplayState] = useState<ReplayState>(ReplayState.PAUSED);
  const [replayDelay, setReplayDelay] = useState<number>(20); // 20 ms
  const replayPosition = useRef<number>(0);
  const [replayLength, setReplayLength] = useState<number>(0);

  const addPacketListener = (fn: (packet: ITelemetryData, position: number) => void): EmitterSubscription => {
    return eventEmitter.current.addListener(PACKET_EVENT, fn);
  };

  const getAllInfos = async () => {
    const rows = await dbService.current.getAllSessions();
    return rows;
  };

  const recordPacket = async (packet: ITelemetryData): Promise<void> => {
    if (currentRecordingFile.current) {
      currentRecordingFile.current.addPacket(packet);
    }
  };

  const openNewRecordingSession = async () => {
    let session = await dbService.current.generateSession();
    currentRecordingFile.current = session;
    setReplayState(ReplayState.RECORDING);
    return session;
  };

  const loadReplay = async (session: ISessionInfo) => {
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
    replayPosition.current = 0;
    setReplayLength(file.info.length);
    logger.log(tag, `Loaded replay: ${file.info.name}`);
  };

  const deleteReplay = async (info: ISessionInfo) => {
    await dbService.current.deleteSession(info.name);
  };

  const closeRecording = async () => {
    if (currentRecordingFile.current) {
      currentRecordingFile.current.close();
      currentRecordingFile.current = undefined;
    }
    setReplayState(ReplayState.IDLE);
  };

  const resume = async () => {
    if (currentFile.current) {
      if(replayState === ReplayState.PAUSED && replayPosition.current >= currentFile.current.info.length){
        currentFile.current.currentReadOffset = 0;
      }
      setReplayState(ReplayState.PLAYING);
      replayPosition.current = currentFile.current.currentReadOffset;
    }
  };

  const restart = async () => {
    if (currentFile.current) {
      loadReplay(currentFile.current.info);
    }
  };

  const pause = async () => {
    if (currentFile.current) {
      setReplayState(ReplayState.PAUSED);
    }
  };

  const closeReplay = async () => {
    if (currentFile.current) {
      currentFile.current.close();
      currentFile.current = undefined;
    }
    setReplayState(ReplayState.PAUSED);
    eventEmitter.current.removeAllListeners(PACKET_EVENT);
    replayPosition.current = 0;
    setReplayLength(0);
  };

  const play = async () => {
    if (replayInterval) {
      clearInterval(replayInterval);
    }
    replayInterval = setInterval(async () => {
      if (currentFile.current) {
        let packet: ITelemetryData | null;
        if (currentFile.current.currentReadOffset >= currentFile.current.info.length) {
          if(replayState !== ReplayState.PAUSED){
            logger.log(tag, `Reached end of replay at position ${currentFile.current.currentReadOffset}, pausing`);
            setReplayState(ReplayState.PAUSED);
            return;
          }
          currentFile.current.currentReadOffset = 0;
        }
        packet = await currentFile.current.readPacket(currentFile.current.currentReadOffset);
        if (packet) {
          replayPosition.current = currentFile.current.currentReadOffset;
          eventEmitter.current.emit(PACKET_EVENT, packet, replayPosition.current);
        } else {
          logger.log(tag, `No more packets to read, stopping replay`);
          setReplayState(ReplayState.PAUSED);
        }
      }
    }, replayDelay);
  };

  const seek = (position: number) => {
    if (currentFile.current) {
      currentFile.current.readPacket(position);
    }
  };

  useEffect(() => {
    const getAll = async () => {
      const records = await dbService.current.getAllSessions();
      logger.log(tag, `records: ${JSON.stringify(records)}`);
    }
    getAll();
  }, []);

  useEffect(() => {
    if (replayState === ReplayState.PLAYING) {
      play();
    } else if (replayInterval) {
      clearInterval(replayInterval);
    }
    return () => clearInterval(replayInterval);
  }, [currentFile.current, replayDelay, replayState]);

  return (
    <RecorderContext.Provider value={{
      recordPacket,
      onPacket: addPacketListener,
      replayInfo: currentFile.current?.info,
      replayPosition: replayPosition.current,
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
      startRecording: openNewRecordingSession,
      closeRecording,
      closeReplay,
      seek,
    }}>
      <ReplayControlsContext.Provider value={{
        replayInfo: currentFile.current?.info,
        replayState,
        replayDelay,
        startRecording: openNewRecordingSession,
        closeRecording,
      }}>
        {props.children}
      </ReplayControlsContext.Provider>
    </RecorderContext.Provider>
  );
}