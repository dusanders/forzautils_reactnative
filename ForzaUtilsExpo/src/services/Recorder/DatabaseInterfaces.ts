import { ITelemetryData } from "ForzaTelemetryApi";
import { ISessionInfo } from "shared";

export const DB_FILE_EXT = 'sqlite';
export const MASTER_DB_NAME = `forza_sessions.${DB_FILE_EXT}`;
export const SESSION_DB_NAME_PREFIX = 'session_';

export interface QueryResult<T> {
  rowsAffected: number;
  columnNames: string[];
  rows: T[];
}


export interface IDatabaseService {
  getAllSessions(): Promise<ISessionInfo[]>;
  getSessionByName(name: string): Promise<ISession | null>;
  generateSession(): Promise<ISession>;
  close(): void;
}

export interface ISession {
  /**
   * Session metadata
   */
  info: ISessionInfo;
  /**
   * Current packet read offset
   */
  currentReadOffset: number;
  /**
   * Add a telemetry packet to the session
   * @param packet Telemetry packet to add
   */
  addPacket(packet: ITelemetryData): Promise<void>;
  /**
   * Read a telemetry packet from the session
   * @param offset Optional offset to read from
   */
  readPacket(offset?: number): Promise<ITelemetryData | null>;
  /**
   * Close the session and free resources
   */
  close(): void;
  /**
   * Delete the session and free resources
   */
  delete(): Promise<void>;
}