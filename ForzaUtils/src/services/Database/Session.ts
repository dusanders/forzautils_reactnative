import { DB, QueryResult, open as SqliteOpen } from '@op-engineering/op-sqlite';
import { ITelemetryData } from "ForzaTelemetryApi";
import { ISession, ISessionInfo, SESSION_DB_NAME_PREFIX, DB_FILE_EXT, MASTER_DB_NAME } from "./DatabaseInterfaces";
import { ILogger, Logger } from '../../context/Logger';
import { FileSystem } from 'react-native-file-access';
import { delay } from '../../types/types';
import { Semaphore } from '../../types/Semaphore';

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
  static fromInfo(info: ISessionInfo, masterDB: DB): ISession {
    return (new Session(info, masterDB).initialize());
  }

  private tag: string;
  private db?: DB;
  private logger: ILogger = Logger();
  private dbSemaphore = new Semaphore(1);
  info: ISessionInfo;
  currentReadOffset: number = 0;

  constructor(info: ISessionInfo,
    private masterDb: DB
  ) {
    this.tag = info.name;
    this.info = info;
  }

  async delete() {
    if (this.db?.getDbPath()) {
      await FileSystem.unlink(this.db.getDbPath());
    }
  }

  async* readPacket(offset?: number): AsyncGenerator<ITelemetryData | null, void, number> {
    this.currentReadOffset = offset !== undefined ? offset : this.currentReadOffset;
    while (this.currentReadOffset < this.info.length) {
      await delay(20);
      const found = await this.executeQuery(
        `SELECT * FROM packets WHERE id = ?`,
        [this.currentReadOffset++]
      );
      if (found && found.rows.length > 0) {
        const casted = found.rows[0] as any as IPacketData;
        if (casted.json && casted.json.length > 0) {
          yield JSON.parse(casted.json);
        } 
      }
    }
  }

  async addPacket(packet: ITelemetryData): Promise<void> {
    if (!this.db) {
      throw new Error(`Failed to add packet - session not initialized`);
    }
    if (this.info.endTime) {
      this.logger.log(this.tag, `Cannot add packet - session ended at: ${this.info.endTime}`);
      return;
    }
    await this.dbSemaphore.acquire();
    await this.updateAllTables(packet, this.info.length);
    this.info.length++;
    this.dbSemaphore.release();
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
  }

  /**
   * Initialize the session databases
   * @returns Session object
   */
  private initialize(): ISession {
    this.db = SqliteOpen({
      name: `${SESSION_DB_NAME_PREFIX}${this.info.name}.${DB_FILE_EXT}`
    });
    this.logger.log(this.tag, `${this.db.getDbPath()}`);
    this.createTables();
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

  private async updateAllTables(packet: ITelemetryData, id: number): Promise<void> {
    await this.executeQuery(
      `INSERT INTO packets (id, json) VALUES (?,?)`,
      [id, JSON.stringify(packet)]
    );
    await this.executeQuery(
      `INSERT INTO rpm_data (id, max, idle, current) VALUES (?,?,?,?)`,
      [id, packet.rpmData.max, packet.rpmData.idle, packet.rpmData.current]
    );
    await this.executeQuery(
      `INSERT INTO acceleration_data (id, x, y, z) VALUES (?,?,?,?)`,
      [id, packet.acceleration.x, packet.acceleration.y, packet.acceleration.z]
    );
    await this.executeQuery(
      `INSERT INTO velocity_data (id, x, y, z) VALUES (?,?,?,?)`,
      [id, packet.velocity.x, packet.velocity.y, packet.velocity.z]
    );
    await this.executeQuery(
      `INSERT INTO angular_velocity_data (id, x, y, z) VALUES (?,?,?,?)`,
      [id, packet.angularVelocity.x, packet.angularVelocity.y, packet.angularVelocity.z]
    );
    await this.executeQuery(
      `INSERT INTO orientation_data (id, yaw, pitch, roll) VALUES (?,?,?,?)`,
      [id, packet.yaw, packet.pitch, packet.roll]
    );
    await this.executeQuery(
      `INSERT INTO normalized_suspension_travel_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?,?,?,?,?)`,
      [id, packet.normalizedSuspensionTravel.leftFront, packet.normalizedSuspensionTravel.leftRear, packet.normalizedSuspensionTravel.rightFront, packet.normalizedSuspensionTravel.rightRear]
    );
    await this.executeQuery(
      `INSERT INTO tire_slip_ratio_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?,?,?,?,?)`,
      [id, packet.tireSlipRatio.leftFront, packet.tireSlipRatio.leftRear, packet.tireSlipRatio.rightFront, packet.tireSlipRatio.rightRear]
    );
    await this.executeQuery(
      `INSERT INTO wheel_rotation_speed_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?,?,?,?,?)`,
      [id, packet.wheelRotationSpeed.leftFront, packet.wheelRotationSpeed.leftRear, packet.wheelRotationSpeed.rightFront, packet.wheelRotationSpeed.rightRear]
    );
    await this.executeQuery(
      `INSERT INTO wheel_on_rumble_strip_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?,?,?,?,?)`,
      [id, packet.wheelOnRumbleStrip.leftFront, packet.wheelOnRumbleStrip.leftRear, packet.wheelOnRumbleStrip.rightFront, packet.wheelOnRumbleStrip.rightRear]
    );
    await this.executeQuery(
      `INSERT INTO wheel_in_puddle_depth_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?,?,?,?,?)`,
      [id, packet.wheelInPuddleDepth.leftFront, packet.wheelInPuddleDepth.leftRear, packet.wheelInPuddleDepth.rightFront, packet.wheelInPuddleDepth.rightRear]
    );
    await this.executeQuery(
      `INSERT INTO surface_rumble_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?,?,?,?,?)`,
      [id, packet.surfaceRumble.leftFront, packet.surfaceRumble.leftRear, packet.surfaceRumble.rightFront, packet.surfaceRumble.rightRear]
    );
    await this.executeQuery(
      `INSERT INTO slip_angle_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?,?,?,?,?)`,
      [id, packet.tireSlipAngle.leftFront, packet.tireSlipAngle.leftRear, packet.tireSlipAngle.rightFront, packet.tireSlipAngle.rightRear]
    );
  }

  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error(`Failed to create tables - session not initialized`);
    }
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS packets (id INT PRIMARY KEY, json VARCHAR)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS rpm_data (id INT PRIMARY KEY, max FLOAT, idle FLOAT, current FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS acceleration_data (id INT PRIMARY KEY, x FLOAT, y FLOAT, z FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS velocity_data (id INT PRIMARY KEY, x FLOAT, y FLOAT, z FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS angular_velocity_data (id INT PRIMARY KEY, x FLOAT, y FLOAT, z FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS orientation_data (id INT PRIMARY KEY, yaw FLOAT, pitch FLOAT, roll FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS normalized_suspension_travel_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS tire_slip_ratio_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS wheel_rotation_speed_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS wheel_on_rumble_strip_data (id INT PRIMARY KEY, leftFront INT, leftRear INT, rightFront INT, rightRear INT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS wheel_in_puddle_depth_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS surface_rumble_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT)`);
    await this.executeQuery(`CREATE TABLE IF NOT EXISTS slip_angle_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT)`);
  }
}