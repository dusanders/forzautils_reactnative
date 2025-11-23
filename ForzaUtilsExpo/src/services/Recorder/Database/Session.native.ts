import { Semaphore } from '@/helpers/Semaphore';
import { File } from 'expo-file-system';
import { Logger } from '@/hooks/Logger';
import { DB, QueryResult, open as SqliteOpen } from '@op-engineering/op-sqlite';
import { ITelemetryData } from "ForzaTelemetryApi";
import { ISession, SESSION_DB_NAME_PREFIX, DB_FILE_EXT } from '../DatabaseInterfaces';
import { CreateTableCommands, InsertTelemetryCommands, ISessionInfo } from 'shared';

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
      const file = new File(this.db.getDbPath());
      if (file.exists) {
        file.delete();
      }
      try {
        this.masterDb.execute(`DELETE FROM sessions WHERE name = ?`, [this.info.name]);
      } catch (error) {
        Logger.error(this.tag, `Error deleting session from master DB: ${error}`);
      }
    }
  }

  async readPacket(offset?: number): Promise<ITelemetryData | null> {
    const target = offset ?? this.currentReadOffset;
    if (target >= this.info.length) return null;

    const found = await this.executeQuery(`SELECT * FROM packets WHERE id = ?`, [target]);
    if (!found || found.rows.length === 0) return null;

    this.currentReadOffset = target + 1;
    const casted = found.rows[0] as unknown as IPacketData;
    return casted.json ? JSON.parse(casted.json) : null;
  }

  async addPacket(packet: ITelemetryData): Promise<void> {
    if (!this.db) {
      throw new Error(`Failed to add packet - session not initialized`);
    }
    if (this.info.endTime) {
      Logger.log(this.tag, `Cannot add packet - session ended at: ${this.info.endTime}`);
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
      Logger.log(this.tag, `Session already has end time: ${this.info.endTime}`);
      return;
    }
    Logger.log(this.tag, `closing @ ${this.info.length} - ${this.info.endTime} with master: ${Boolean(this.masterDb)}`);
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
    Logger.log(this.tag, `${this.db.getDbPath()}`);
    this.createTables();
    Logger.log(this.tag, `initialized with ${JSON.stringify(this.info)}`);
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
      InsertTelemetryCommands.packets,
      [id, JSON.stringify(packet)]
    );
    await this.executeQuery(
      InsertTelemetryCommands.rpm_data,
      [id, packet.rpmData.max, packet.rpmData.idle, packet.rpmData.current]
    );
    await this.executeQuery(
      InsertTelemetryCommands.acceleration_data,
      [id, packet.acceleration.x, packet.acceleration.y, packet.acceleration.z]
    );
    await this.executeQuery(
      InsertTelemetryCommands.velocity_data,
      [id, packet.velocity.x, packet.velocity.y, packet.velocity.z]
    );
    await this.executeQuery(
      InsertTelemetryCommands.angular_velocity_data,
      [id, packet.angularVelocity.x, packet.angularVelocity.y, packet.angularVelocity.z]
    );
    await this.executeQuery(
      InsertTelemetryCommands.orientation_data,
      [id, packet.yaw, packet.pitch, packet.roll]
    );
    await this.executeQuery(
      InsertTelemetryCommands.normalized_suspension_travel_data,
      [id, packet.normalizedSuspensionTravel.leftFront, packet.normalizedSuspensionTravel.leftRear, packet.normalizedSuspensionTravel.rightFront, packet.normalizedSuspensionTravel.rightRear]
    );
    await this.executeQuery(
      InsertTelemetryCommands.tire_slip_ratio_data,
      [id, packet.tireSlipRatio.leftFront, packet.tireSlipRatio.leftRear, packet.tireSlipRatio.rightFront, packet.tireSlipRatio.rightRear]
    );
    await this.executeQuery(
      InsertTelemetryCommands.wheel_rotation_speed_data,
      [id, packet.wheelRotationSpeed.leftFront, packet.wheelRotationSpeed.leftRear, packet.wheelRotationSpeed.rightFront, packet.wheelRotationSpeed.rightRear]
    );
    await this.executeQuery(
      InsertTelemetryCommands.wheel_on_rumble_strip_data,
      [id, packet.wheelOnRumbleStrip.leftFront, packet.wheelOnRumbleStrip.leftRear, packet.wheelOnRumbleStrip.rightFront, packet.wheelOnRumbleStrip.rightRear]
    );
    await this.executeQuery(
      InsertTelemetryCommands.wheel_in_puddle_depth_data,
      [id, packet.wheelInPuddleDepth.leftFront, packet.wheelInPuddleDepth.leftRear, packet.wheelInPuddleDepth.rightFront, packet.wheelInPuddleDepth.rightRear]
    );
    await this.executeQuery(
      InsertTelemetryCommands.surface_rumble_data,
      [id, packet.surfaceRumble.leftFront, packet.surfaceRumble.leftRear, packet.surfaceRumble.rightFront, packet.surfaceRumble.rightRear]
    );
    await this.executeQuery(
      InsertTelemetryCommands.slip_angle_data,
      [id, packet.tireSlipAngle.leftFront, packet.tireSlipAngle.leftRear, packet.tireSlipAngle.rightFront, packet.tireSlipAngle.rightRear]
    );
  }

  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error(`Failed to create tables - session not initialized`);
    }
    await this.executeQuery(CreateTableCommands.packets);
    await this.executeQuery(CreateTableCommands.rpm_data);
    await this.executeQuery(CreateTableCommands.acceleration_data);
    await this.executeQuery(CreateTableCommands.velocity_data);
    await this.executeQuery(CreateTableCommands.angular_velocity_data);
    await this.executeQuery(CreateTableCommands.orientation_data);
    await this.executeQuery(CreateTableCommands.normalized_suspension_travel_data);
    await this.executeQuery(CreateTableCommands.tire_slip_ratio_data);
    await this.executeQuery(CreateTableCommands.wheel_rotation_speed_data);
    await this.executeQuery(CreateTableCommands.wheel_on_rumble_strip_data);
    await this.executeQuery(CreateTableCommands.wheel_in_puddle_depth_data);
    await this.executeQuery(CreateTableCommands.surface_rumble_data);
    await this.executeQuery(CreateTableCommands.slip_angle_data);
  }
}