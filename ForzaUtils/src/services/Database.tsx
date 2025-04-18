import { DB, open as SqliteOpen } from '@op-engineering/op-sqlite';
import { ForzaTelemetryApi, ITelemetryData } from 'ForzaTelemetryApi';

const DB_FILE_EXT = 'sqlite';
const MASTER_DB_NAME = `forza_sessions.${DB_FILE_EXT}`;
const SESSION_DB_NAME_PREFIX = 'session_';

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

interface IPacketData {
  id: number;
  buffLength: number;
  data: Buffer;
}

export class Session implements ISession {
  static fromInfo(info: ISessionInfo): ISession {
    return (new Session(info).initialize());
  }

  private db?: DB;
  private masterDb?: DB;
  private readCounter = 0;
  info: ISessionInfo;

  constructor(info: ISessionInfo) {
    this.info = info;
  }
  async readPacket(offset?: number): Promise<ITelemetryData | null> {
    let readOffset = offset || this.readCounter;
    this.readCounter = readOffset;
    const found = await this.executeQuery(
      `SELECT * FROM packets WHERE id = ?`,
      [this.readCounter++]
    );
    const casted = found as IPacketData[];
    if(casted.length > 0) {
      const packetData = casted[0];
      return ForzaTelemetryApi.parseData(packetData.buffLength, packetData.data);
    }
    return null;
  }
  async addPacket(buffer: Buffer): Promise<void> {
    if (!this.db) {
      throw new Error(`Failed to add packet - session not initialized`);
    }
    this.executeQuery(
      `INSERT INTO packets (id, buffer) VALUES (?,?)`,
      [this.info.length++, buffer]
    );
  }
  close(): void {
    this.info.endTime = Date.now();
    this.masterDb?.executeRaw(
      `UPDATE sessions SET length = ?, endTime = ? WHERE name = ?`,
      [this.info.length, this.info.endTime, this.info.name]
    );
    this.db?.close();
    this.masterDb?.close();
  }
  private initialize(): ISession {
    this.db = SqliteOpen({
      name: `${SESSION_DB_NAME_PREFIX}${this.info.name}.${DB_FILE_EXT}`
    });
    this.masterDb = SqliteOpen({
      name: MASTER_DB_NAME
    });
    this.executeQuery(`CREATE TABLE packets (id INT PRIMARY KEY, buffer BLOB)`);
    return this;
  }
  private async executeQuery(query: string, params: any[] = []): Promise<any> {
    try {
      return await this.db?.execute(query, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}

export interface IDatabaseService {
  getAllSessions(): Promise<ISession[]>;
  getSessionByName(name: string): Promise<ISession | null>;
  generateSession(): Promise<ISession>;
  deleteSession(name: string): Promise<void>;
  close(): void;
}

export class DatabaseService implements IDatabaseService {
  private static instance: DatabaseService | undefined;
  private db: DB; // Replace 'any' with your actual database type

  private constructor() {
    this.db = SqliteOpen({ name: MASTER_DB_NAME });
  }

  static getInstance(): IDatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
      DatabaseService.instance.executeQuery(
        `CREATE TABLE IF NOT EXISTS sessions (name VARCHAR(255) PRIMARY KEY, length INT, startTime INT, endTime INT)`
      )
    }
    return DatabaseService.instance;
  }

  getAllSessions(): Promise<ISession[]> {
    return this.executeQuery('SELECT * FROM sessions');
  }
  async getSessionByName(name: string): Promise<ISession | null> {
    const rows = await this.executeQuery(
      `SELECT * FROM sessions WHERE name = ?`,
      [name]
    );
    return (rows as ISessionInfo[])?.length > 0 ? rows[0] : null;
  }
  async generateSession(): Promise<ISession> {
    const session: ISessionInfo = {
      name: `${SESSION_DB_NAME_PREFIX}${Date.now()}`,
      length: 0, // Initialize length to 0 or any default value
      startTime: Date.now(),
      endTime: Date.now() // Default to 1 hour later
    };
    await this.executeQuery(
      'INSERT INTO sessions (name, length, startTime, endtime) VALUES (?, ?, ?, ?)',
      [session.name, session.length, session.startTime, session.endTime]
    );
    return Session.fromInfo(session);
  }
  async deleteSession(name: string): Promise<void> {
    await this.executeQuery(
      'DELETE FROM sessions WHERE name = ?',
      [name]
    );
  }

  private async executeQuery(query: string, params: any[] = []): Promise<any> {
    try {
      return await this.db.execute(query, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  close(): void {
    this.db.close();
  }
}
