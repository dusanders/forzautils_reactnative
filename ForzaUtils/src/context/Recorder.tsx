import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { DatabaseService } from "../services/Database/Database";
import { useLogger } from "./Logger";
import { ISessionInfo, ISession } from "../services/Database/DatabaseInterfaces";
import { ITelemetryData } from "ForzaTelemetryApi";
import EventEmitter, { EmitterSubscription } from "react-native/Libraries/vendor/emitter/EventEmitter";
import { Semaphore } from "../types/Semaphore";
import { useNetworkContext } from "./Network";


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
  const controlSemaphore = useRef<Semaphore>(new Semaphore(1));
  const currentFile = useRef<ISession>(undefined);
  const fileReadStream = useRef<AsyncGenerator<ITelemetryData | null, void, number>>();
  const [replayState, setReplayState] = useState<ReplayState>(ReplayState.PAUSED);
  const [replayDelay, setReplayDelay] = useState<number>(20); // 20 ms
  const replayPosition = useRef<number>(0);
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
    fileReadStream.current = currentFile.current.readPacket();
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
    fileReadStream.current = currentFile.current.readPacket();
    setReplayState(ReplayState.PAUSED);
    replayPosition.current = 0;
    setReplayLength(file.info.length);
    logger.log(tag, `Loaded replay: ${file.info.name}`);
  }, [logger]);

  const deleteReplay = useCallback(async (info: ISessionInfo) => {
    await dbService.current.deleteSession(info.name);
  }, []);

  const closeRecording = async () => {
    await controlSemaphore.current.acquire();
    if (currentFile.current) {
      currentFile.current.close();
      currentFile.current = undefined;
    }
    setReplayState(ReplayState.PAUSED);
    controlSemaphore.current.release();
  };

  const resume = async () => {
    await controlSemaphore.current.acquire();
    if (currentFile.current) {
      setReplayState(ReplayState.PLAYING);
      replayPosition.current = currentFile.current.currentReadOffset;
    }
    controlSemaphore.current.release();
  };

  const restart = async () => {
    await controlSemaphore.current.acquire();
    if (currentFile.current) {
      loadReplay(currentFile.current.info);
    }
    controlSemaphore.current.release();
  };

  const pause = async () => {
    await controlSemaphore.current.acquire();
    if (currentFile.current) {
      setReplayState(ReplayState.PAUSED);
    }
    controlSemaphore.current.release();
  };

  const closeReplay = async () => {
    await controlSemaphore.current.acquire();
    if (currentFile.current) {
      currentFile.current.close();
      currentFile.current = undefined;
    }
    setReplayState(ReplayState.PAUSED);
    eventEmitter.current.removeAllListeners(PACKET_EVENT);
    replayPosition.current = 0;
    setReplayLength(0);
    controlSemaphore.current.release();
  };

  const play = async () => {
    await controlSemaphore.current.acquire();
    if (replayInterval) {
      clearInterval(replayInterval);
    }
    replayInterval = setInterval(async () => {
      if (currentFile.current) {
        if(currentFile.current.currentReadOffset >= currentFile.current.info.length) {
          fileReadStream.current = currentFile.current.readPacket(0);
        }
        const packet = await fileReadStream.current?.next();
        logger.debug(tag, `Reader is done: ${packet?.done}`);
        if (!packet?.done) {
          replayPosition.current = currentFile.current.currentReadOffset;
          eventEmitter.current.emit(PACKET_EVENT, packet?.value, replayPosition.current);
        } else {
          logger.log(tag, `No more packets to read, stopping replay`);
          setReplayState(ReplayState.PAUSED);
        }
      }
    }, replayDelay);
    controlSemaphore.current.release();
  }

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

  logger.log(tag, `Rendering RecorderProvider.tsx - replayState: ${replayState}, replayPosition: ${replayPosition}, replayLength: ${replayLength}`);
  return (
    <RecorderContext.Provider value={{
      recordPacket: async (packet: ITelemetryData): Promise<void> => {
        if (replayState === ReplayState.RECORDING && currentFile.current) {
          await currentFile.current.addPacket(packet);
        }
      },
      onPacket: (fn: (packet: ITelemetryData, position: number) => void): EmitterSubscription => {
        return eventEmitter.current.addListener(PACKET_EVENT, fn);
      },
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
      startRecording: initRecording,
      closeRecording,
      closeReplay,
    }}>
      <ReplayControlsContext.Provider value={{
        replayInfo: currentFile.current?.info,
        replayState,
        replayDelay,
        startRecording: initRecording,
        closeRecording,
      }}>
        {props.children}
      </ReplayControlsContext.Provider>
    </RecorderContext.Provider>
  );
}