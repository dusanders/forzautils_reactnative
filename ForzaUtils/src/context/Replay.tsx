import React, { createContext, useContext, useEffect, useRef } from "react";
import { DatabaseService } from "../services/Database/Database";
import { useLogger } from "./Logger";
import { ISessionInfo, ISession } from "../services/Database/DatabaseInterfaces";

export interface IReplay {
  getAllSessions(): Promise<ISessionInfo[]>;
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
    if(info) {
      logger.log(tag, `looking for requested ${info.name}`);
      session = await dbService.current.getSessionByName(info.name);
      logger.log(tag, `found existing ${info.name}`);
    }
    if(!session) {
      session = await dbService.current.generateSession();
    }
    return session;
  }

  return (
    <ReplayContext.Provider value={{
      getAllSessions: () => getAllInfos(),
      getOrCreate: (info) => doGetOrCreate(info),
      delete: (info) => {
        dbService.current.deleteSession(info.name);
      }
    }}>
      {props.children}
    </ReplayContext.Provider>
  )
}