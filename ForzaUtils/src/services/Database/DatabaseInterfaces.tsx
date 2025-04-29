import { ITelemetryData } from "ForzaTelemetryApi";

export const DB_FILE_EXT = 'sqlite';
export const MASTER_DB_NAME = `forza_sessions.${DB_FILE_EXT}`;
export const SESSION_DB_NAME_PREFIX = 'session_';

export interface QueryResult<T> {
  rowsAffected: number;
  columnNames: string[];
  rows: T[];
}

export interface ISessionInfo {
  name: string;
  length: number;
  startTime: number;
  endTime: number;
}

export interface ISession {
  info: ISessionInfo;
  addPacket(buffer: Buffer): Promise<void>;
  readPacket(offset?: number): Promise<ITelemetryData | null>;
  close(): void;
}