import { CreateTableCommands, InsertTelemetryCommands, IpcActions_Session, ISessionInfo, ITelemetryData } from "shared";
import { ISupportRendererService } from "../../renderer/renderer.types.js";
import * as fs from "node:fs/promises";
import * as Sqlite from "node:sqlite";
import * as Path from "path";
const __dirname = import.meta.dirname;

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

export class Session implements ISupportRendererService {
  private currentSession: ISessionInfo | undefined;
  private currentReadOffset: number = 0;
  private currentWriteOffset: number = 0;
  private sessionDb: Sqlite.DatabaseSync | undefined;
  constructor(
    private win: Electron.BrowserWindow,
    private mainDatabase: Sqlite.DatabaseSync
  ) { }
  attachHandlers(ipcMain: Electron.IpcMain): void {
    ipcMain.handle(IpcActions_Session.AddPacket, (event, packet) => {
      return this.addPacket(packet);
    });
    ipcMain.handle(IpcActions_Session.ReadPacket, (event, offset) => {
      return this.readPacket(offset);
    });
    ipcMain.handle(IpcActions_Session.Close, (event) => {
      this.close();
    });
    ipcMain.handle(IpcActions_Session.Delete, (event) => {
      return this.delete();
    });
    ipcMain.handle(IpcActions_Session.Open, (event, info) => {
      return this.open(info);
    });
  }
  private async addPacket(packet: ITelemetryData): Promise<void> {
    const id = this.currentWriteOffset;
    await this.insertPacketValues(id, packet);
    this.currentWriteOffset++;
  }

  private async readPacket(offset?: number): Promise<ITelemetryData | null> {
    const targetOffset = offset ?? this.currentReadOffset;
    const packetStmt = this.sessionDb?.prepare(
      'SELECT * FROM packets WHERE id = ?'
    );
    const result = packetStmt?.get(targetOffset);
    if (result) {
      this.currentReadOffset = targetOffset + 1;
      const dbPacket: IPacketData = {
        id: Number(result.id),
        json: String(result.json)
      };
      return JSON.parse(dbPacket.json) as ITelemetryData;
    }
    return null;
  }

  private close(): void {
    if (this.currentSession) {
      this.sessionDb?.close();
      this.currentReadOffset = 0;
      this.currentSession = undefined;
      this.sessionDb = undefined;
    }
  }

  private async delete(): Promise<void> {
    if (this.currentSession) {
      const deleteStmt = this.mainDatabase.prepare(
        'DELETE FROM sessions WHERE name = ?'
      );
      deleteStmt.run(this.currentSession.name);
      const sessionDbPath = this.getFilePathForSessionDb(this.currentSession.name);
      this.sessionDb?.close();
      await fs.unlink(sessionDbPath);
      this.currentReadOffset = 0;
      this.currentSession = undefined;
      this.sessionDb = undefined;
    }
  }

  private async open(info: any): Promise<ISessionInfo> {
    // Implement logic to open session
    this.currentSession = info;
    const sessionDbPath = this.getFilePathForSessionDb(info.name);
    this.sessionDb = new Sqlite.DatabaseSync(sessionDbPath);
    await this.ensureTables();
    return info;
  }

  private getFilePathForSessionDb(sessionName: string): string {
    return Path.join(__dirname, '..', '..', 'databases', 'sessions', `${sessionName}.db`);
  }

  private insertPacketValues(id: number, packet: ITelemetryData): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.packets,
          [id, JSON.stringify(packet)]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.rpm_data,
          [id, packet.rpmData.max, packet.rpmData.idle, packet.rpmData.current]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.acceleration_data,
          [id, packet.acceleration.x, packet.acceleration.y, packet.acceleration.z]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.velocity_data,
          [id, packet.velocity.x, packet.velocity.y, packet.velocity.z]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.angular_velocity_data,
          [id, packet.angularVelocity.x, packet.angularVelocity.y, packet.angularVelocity.z]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.orientation_data,
          [id, packet.yaw, packet.pitch, packet.roll]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.normalized_suspension_travel_data,
          [id, packet.normalizedSuspensionTravel.leftFront, packet.normalizedSuspensionTravel.leftRear, packet.normalizedSuspensionTravel.rightFront, packet.normalizedSuspensionTravel.rightRear]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.tire_slip_ratio_data,
          [id, packet.tireSlipRatio.leftFront, packet.tireSlipRatio.leftRear, packet.tireSlipRatio.rightFront, packet.tireSlipRatio.rightRear]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.wheel_rotation_speed_data,
          [id, packet.wheelRotationSpeed.leftFront, packet.wheelRotationSpeed.leftRear, packet.wheelRotationSpeed.rightFront, packet.wheelRotationSpeed.rightRear]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.wheel_on_rumble_strip_data,
          [id, packet.wheelOnRumbleStrip.leftFront, packet.wheelOnRumbleStrip.leftRear, packet.wheelOnRumbleStrip.rightFront, packet.wheelOnRumbleStrip.rightRear]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.wheel_in_puddle_depth_data,
          [id, packet.wheelInPuddleDepth.leftFront, packet.wheelInPuddleDepth.leftRear, packet.wheelInPuddleDepth.rightFront, packet.wheelInPuddleDepth.rightRear]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.surface_rumble_data,
          [id, packet.surfaceRumble.leftFront, packet.surfaceRumble.leftRear, packet.surfaceRumble.rightFront, packet.surfaceRumble.rightRear]
        );
        this.executeStatementWithoutResult(
          InsertTelemetryCommands.slip_angle_data,
          [id, packet.tireSlipAngle.leftFront, packet.tireSlipAngle.leftRear, packet.tireSlipAngle.rightFront, packet.tireSlipAngle.rightRear]
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private ensureTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.executeStatementWithoutResult(CreateTableCommands.packets);
        this.executeStatementWithoutResult(CreateTableCommands.rpm_data);
        this.executeStatementWithoutResult(CreateTableCommands.acceleration_data);
        this.executeStatementWithoutResult(CreateTableCommands.velocity_data);
        this.executeStatementWithoutResult(CreateTableCommands.angular_velocity_data);
        this.executeStatementWithoutResult(CreateTableCommands.orientation_data);
        this.executeStatementWithoutResult(CreateTableCommands.normalized_suspension_travel_data);
        this.executeStatementWithoutResult(CreateTableCommands.tire_slip_ratio_data);
        this.executeStatementWithoutResult(CreateTableCommands.wheel_rotation_speed_data);
        this.executeStatementWithoutResult(CreateTableCommands.wheel_on_rumble_strip_data);
        this.executeStatementWithoutResult(CreateTableCommands.wheel_in_puddle_depth_data);
        this.executeStatementWithoutResult(CreateTableCommands.surface_rumble_data);
        this.executeStatementWithoutResult(CreateTableCommands.slip_angle_data);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private executeStatementWithoutResult(stmt: string, params: any[] = []): void {
    this.sessionDb?.prepare(stmt).run(...params);
  }

  private executeQuery(stmt: string, params: any[] = []): any {
    return this.sessionDb?.prepare(stmt).get(...params);
  }
}