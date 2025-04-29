import { DB, open as SqliteOpen } from '@op-engineering/op-sqlite';
import { ITelemetryData, ForzaTelemetryApi } from "ForzaTelemetryApi";
import { ISession, ISessionInfo, SESSION_DB_NAME_PREFIX, DB_FILE_EXT, MASTER_DB_NAME } from "./DatabaseInterfaces";
import { ILogger, Logger, useLogger } from '../../context/Logger';

interface IPacketData {
  id: number;
  buffLength: number;
  data: Buffer;
}

export class Session implements ISession {
  static fromInfo(info: ISessionInfo): ISession {
    return (new Session(info).initialize());
  }
  private tag: string;
  private db?: DB;
  private masterDb?: DB;
  private readCounter = 0;
  private logger: ILogger = Logger();
  info: ISessionInfo;

  constructor(info: ISessionInfo) {
    this.tag = info.name;
    this.info = info;
  }
  delete() {
    this.db?.delete();
  }
  async readPacket(offset?: number): Promise<ITelemetryData | null> {
    let readOffset = offset || this.readCounter;
    this.readCounter = readOffset;
    const found = await this.executeQuery(
      `SELECT * FROM packets WHERE id = ?`,
      [this.readCounter++]
    );
    const casted = found as IPacketData[];
    if (casted.length > 0) {
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
    this.logger.log(this.tag, `${this.db.getDbPath()}`);
    this.executeQuery(`CREATE TABLE IF NOT EXISTS packets (id INT PRIMARY KEY, buffer BLOB)`);
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