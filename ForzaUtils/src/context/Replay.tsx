import React, { createContext, useContext, useEffect, useRef } from "react";
import { DatabaseService } from "../services/Database/Database";
import { useLogger } from "./Logger";
import { ISessionInfo, ISession } from "../services/Database/DatabaseInterfaces";
import { ITelemetryData } from "ForzaTelemetryApi";

export interface IReplay {
  session?: ISession;
  getAllSessions(): Promise<ISessionInfo[]>;
  setSession(session: ISession): void;
  closeSession(): void;
  submitPacket(packet: ITelemetryData): void;
  getOrCreate(info?: ISessionInfo): Promise<ISession>;
  delete(info: ISessionInfo): void;
}

export interface ReplayProviderProps {
  children?: any;
}

export const ReplayContext = createContext({} as IReplay);
export function useReplay() {
  return useContext(ReplayContext);
}
export function ReplayProvider(props: ReplayProviderProps) {
  const tag = 'ReplayProvider.tsx';
  const logger = useLogger();
  const dbService = useRef(DatabaseService.getInstance());
  const currentFile = useRef<ISession>(undefined);

  useEffect(() => {
    const getAll = async () => {
      const records = await dbService.current.getAllSessions();
      logger.log(tag, `records: ${JSON.stringify(records)}`);
    }
    getAll();
  }, []);

  const getAllInfos = async () => {
    const rows = await dbService.current.getAllSessions();
    return rows;
  }

  const doGetOrCreate = async (info?: ISessionInfo) => {
    let session: ISession | null = null;
    if (info) {
      session = await dbService.current.getSessionByName(info.name);
      logger.log(tag, `found existing ${info.name}`);
    }
    if (!session) {
      session = await dbService.current.generateSession();
    }
    return session;
  }

  return (
    <ReplayContext.Provider value={{
      session: currentFile.current,
      getAllSessions: () => getAllInfos(),
      getOrCreate: (info) => doGetOrCreate(info),
      delete: (info) => {
        dbService.current.deleteSession(info.name);
      },
      setSession: (session) => {
        currentFile.current = session;
      },
      submitPacket: (packet) => {
        if (currentFile.current) {
          currentFile.current.addPacket(packet);
        }
      },
      closeSession: () => {
        if (currentFile.current) {
          currentFile.current.close();
        }
      }
    }}>
      {props.children}
    </ReplayContext.Provider>
  )
}