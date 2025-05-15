import { DB, QueryResult, open as SqliteOpen } from '@op-engineering/op-sqlite';
import { ITelemetryData } from "ForzaTelemetryApi";
import { ISession, ISessionInfo, SESSION_DB_NAME_PREFIX, DB_FILE_EXT, MASTER_DB_NAME } from "./DatabaseInterfaces";
import { ILogger, Logger } from '../../context/Logger';
import { FileSystem } from 'react-native-file-access';

/**
 * Structure of the packet data in the database
 */
interface IPacketData {
  /**
   * Unique identifier for the packet
   * Sequentially incremented
   * @type {number}
   */
  id: number;
  /**
   * JSON string representation of the telemetry data
   * @type {string}
   */
  json: string;
}

export class Session implements ISession {
  /**
   * Factory method to create a new session
   * @param info Session metadata
   * @returns 
   */
  static fromInfo(info: ISessionInfo): ISession {
    return (new Session(info).initialize());
  }

  private tag: string;
  private db?: DB;
  private masterDb?: DB;
  private logger: ILogger = Logger();
  info: ISessionInfo;
  currentReadOffset: number = 0;

  constructor(info: ISessionInfo) {
    this.tag = info.name;
    this.info = info;
  }

  async delete() {
    if (this.db?.getDbPath()) {
      await FileSystem.unlink(this.db.getDbPath());
    }
  }

  async readPacket(offset?: number): Promise<ITelemetryData | null> {
    let readOffset = offset || this.currentReadOffset;
    this.currentReadOffset = readOffset;
    if (this.currentReadOffset >= this.info.length) {
      this.logger.log(this.tag, `No more packets to read`);
      this.currentReadOffset = 0;
    }
    const found = await this.executeQuery(
      `SELECT * FROM packets WHERE id = ?`,
      [this.currentReadOffset++]
    );
    const casted = (found!.rows[0] as any) as IPacketData;
    if (casted.json.length > 0) {
      return JSON.parse(casted.json);
    }
    return null;
  }

  async addPacket(packet: ITelemetryData): Promise<void> {
    if (!this.db) {
      throw new Error(`Failed to add packet - session not initialized`);
    }
    if (this.info.endTime) {
      return;
    }
    this.executeQuery(
      `INSERT INTO packets (id, json) VALUES (?,?)`,
      [this.info.length++, JSON.stringify(packet)]
    );
  }

  close(): void {
    if (!this.db || !this.masterDb) {
      throw new Error(`Failed to add packet - session not initialized`);
    }
    if (this.info.endTime) {
      this.logger.log(this.tag, `Session already has end time: ${this.info.endTime}`);
      return;
    }
    this.logger.log(this.tag, `closing @ ${this.info.length} - ${this.info.endTime} with master: ${Boolean(this.masterDb)}`);
    this.info.endTime = Date.now();
    this.masterDb?.executeRaw(
      `UPDATE sessions SET length = ?, endTime = ? WHERE name = ?`,
      [this.info.length, this.info.endTime, this.info.name]
    );
    this.db?.close();
    this.masterDb?.close();
  }

  /**
   * Initialize the session databases
   * @returns Session object
   */
  private initialize(): ISession {
    this.db = SqliteOpen({
      name: `${SESSION_DB_NAME_PREFIX}${this.info.name}.${DB_FILE_EXT}`
    });
    this.masterDb = SqliteOpen({
      name: MASTER_DB_NAME
    });
    this.logger.log(this.tag, `${this.db.getDbPath()}`);
    this.executeQuery(`CREATE TABLE IF NOT EXISTS packets (id INT PRIMARY KEY, json VARCHAR)`);
    this.logger.log(this.tag, `initialized with ${JSON.stringify(this.info)}`);
    return this;
  }

  /**
   * Query the database
   * @param query Sqlite query to execute
   * @param params Parameters to bind to the query
   * @returns 
   */
  private async executeQuery(query: string, params: any[] = []): Promise<QueryResult | undefined> {
    try {
      return await this.db?.execute(query, params);
    } catch (error) {
      console.error('Database query error:', error);
      return undefined;
    }
  }
}