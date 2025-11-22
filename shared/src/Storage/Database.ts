import { ITelemetryData } from "ForzaTelemetryApi";

export interface ISessionInfo {
  name: string;
  length: number;
  startTime: number;
  endTime: number;
}

export const IpcActions_Database = {
  GetAllSessions: "DatabaseRequest.GetAllSessions",
  GenerateSession: "DatabaseRequest.GenerateSession",
}

export const IpcActions_Session = {
  AddPacket: "SessionRequest.AddPacket",
  ReadPacket: "SessionRequest.ReadPacket",
  Close: "SessionRequest.Close",
  Delete: "SessionRequest.Delete",
}

export interface ContextBridge_Session {
  info: ISessionInfo;
  currentReadOffset: number;
  addPacket(packet: ITelemetryData): Promise<void>;
  readPacket(offset?: number): Promise<ITelemetryData | null>;
  close(): Promise<void>;
  delete(): Promise<void>;
}

export interface ContextBridge_Database {
  getAllSessions(): Promise<ISessionInfo[]>;
  generateSession(name: string): Promise<ISessionInfo>;
  close(): Promise<void>;
}