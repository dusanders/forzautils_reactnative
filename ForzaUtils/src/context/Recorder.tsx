import React, { createContext, useContext, useEffect, useRef, useState } from "react";
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
  replayPacket: ITelemetryData | undefined;
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
export function useReplay() {
  return useContext(RecorderContext);
}
export function RecorderProvider(props: RecorderProviderProps) {
  const tag = 'RecorderProvider.tsx';
  let replayInterval: NodeJS.Timeout | undefined = undefined;
  const logger = useLogger();
  const wifiPacket = packetService();
  const dbService = useRef(DatabaseService.getInstance());
  const currentFile = useRef<ISession>(undefined);
  const replayPacket = useRef<ITelemetryData | undefined>(undefined);
  const [replayState, setReplayState] = useState<ReplayState>(ReplayState.PAUSED);
  const [replayDelay, setReplayDelay] = useState<number>(1000 / 30); // 30 FPS
  const [replayPosition, setReplayPosition] = useState<number>(0);
  const [replayLength, setReplayLength] = useState<number>(0);

  const getAllInfos = async () => {
    const rows = await dbService.current.getAllSessions();
    return rows;
  }

  const initRecording = async () => {
    if (currentFile.current) {
      return currentFile.current
    }
    let session = await dbService.current.generateSession();
    currentFile.current = session;
    setReplayState(ReplayState.RECORDING);
    return session;
  }

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
    setReplayPosition(0);
    setReplayLength(file.info.length);
    logger.log(tag, `Loaded replay: ${file.info.name}`);
  }

  const deleteReplay = async (info: ISessionInfo) => {
    await dbService.current.deleteSession(info.name);
  }

  const closeRecording = () => {
    if (currentFile.current) {
      currentFile.current.close();
      currentFile.current = undefined;
    }
    setReplayState(ReplayState.PAUSED);
  }

  const resume = () => {
    if (currentFile.current) {
      setReplayState(ReplayState.PLAYING);
      setReplayPosition(currentFile.current.currentReadOffset);
    }
  }

  const restart = () => {
    if (currentFile.current) {
      loadReplay(currentFile.current.info);
    }
  }

  const pause = () => {
    if (currentFile.current) {
      setReplayState(ReplayState.PAUSED);
    }
  }

  const closeReplay = () => {
    if (currentFile.current) {
      currentFile.current.close();
      currentFile.current = undefined;
    }
    setReplayState(ReplayState.PAUSED);
    replayPacket.current = undefined;
    setReplayPosition(0);
    setReplayLength(0);
  }

  useEffect(() => {
    const getAll = async () => {
      const records = await dbService.current.getAllSessions();
      logger.log(tag, `records: ${JSON.stringify(records)}`);
    }
    getAll();
  }, []);

  useEffect(() => {
    if (currentFile.current && replayState === ReplayState.RECORDING && wifiPacket.packet) {
      currentFile.current.addPacket(wifiPacket.packet)
    }
  }, [currentFile.current, wifiPacket.packet, replayState]);

  useEffect(() => {
    if (replayState === ReplayState.PLAYING) {
      replayInterval = setInterval(async () => {
        if (currentFile.current) {
          const packet = (await currentFile.current.readPacket()) || undefined;
          if (packet) {
            replayPacket.current = packet;
            setReplayPosition(currentFile.current.currentReadOffset);
          } else {
            logger.log(tag, `No more packets to read, stopping replay`);
            setReplayState(ReplayState.PAUSED);
          }
        }
      }, replayDelay);
      return () => clearInterval(replayInterval);
    }
    if (replayState === ReplayState.PAUSED && replayInterval) {
      clearInterval(replayInterval);
    }
  }, [currentFile.current, replayDelay, replayState]);

  return (
    <RecorderContext.Provider value={{
      replayInfo: currentFile.current?.info,
      replayPosition,
      replayLength,
      replayPacket: replayPacket.current,
      replayState: currentFile.current ? replayState : ReplayState.IDLE,
      replayDelay,
      setReplayDelay,
      pause: () => pause(),
      restart: () => restart(),
      resume: () => resume(),
      loadReplay: (session: ISessionInfo) => loadReplay(session),
      getAllSessions: () => getAllInfos(),
      delete: (info: ISessionInfo) => deleteReplay(info),
      startRecording: () => initRecording(),
      closeRecording: () => closeRecording(),
      closeReplay: () => closeReplay(),
    }}>
      {props.children}
    </RecorderContext.Provider>
  )
}