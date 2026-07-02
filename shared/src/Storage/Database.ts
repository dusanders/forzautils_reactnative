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
  Close: "DatabaseRequest.Close",
}

export const IpcActions_Session = {
  AddPacket: "SessionRequest.AddPacket",
  ReadPacket: "SessionRequest.ReadPacket",
  Close: "SessionRequest.Close",
  Delete: "SessionRequest.Delete",
  Open: "SessionRequest.Open",
}

export interface ContextBridge_Session {
  addPacket(packet: ITelemetryData): Promise<void>;
  readPacket(offset?: number): Promise<ITelemetryData | null>;
  close(): Promise<void>;
  delete(): Promise<void>;
  open(info: ISessionInfo): Promise<ISessionInfo>;
}

export interface ContextBridge_Database {
  getAllSessions(): Promise<ISessionInfo[]>;
  generateSession(): Promise<ISessionInfo>;
  close(): Promise<void>;
}

export const CreateTableCommands = {
  packets: 'CREATE TABLE IF NOT EXISTS packets (id INTEGER PRIMARY KEY, json TEXT);',
  rpm_data: 'CREATE TABLE IF NOT EXISTS rpm_data (id INTEGER PRIMARY KEY, max FLOAT, idle FLOAT, current FLOAT);',
  acceleration_data: 'CREATE TABLE IF NOT EXISTS acceleration_data (id INT PRIMARY KEY, x FLOAT, y FLOAT, z FLOAT);',
  velocity_data: 'CREATE TABLE IF NOT EXISTS velocity_data (id INT PRIMARY KEY, x FLOAT, y FLOAT, z FLOAT);',
  angular_velocity_data: 'CREATE TABLE IF NOT EXISTS angular_velocity_data (id INT PRIMARY KEY, x FLOAT, y FLOAT, z FLOAT);',
  orientation_data: 'CREATE TABLE IF NOT EXISTS orientation_data (id INT PRIMARY KEY, yaw FLOAT, pitch FLOAT, roll FLOAT);',
  normalized_suspension_travel_data: 'CREATE TABLE IF NOT EXISTS normalized_suspension_travel_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT);',
  tire_slip_ratio_data: 'CREATE TABLE IF NOT EXISTS tire_slip_ratio_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT);',
  wheel_rotation_speed_data: 'CREATE TABLE IF NOT EXISTS wheel_rotation_speed_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT);',
  wheel_on_rumble_strip_data: 'CREATE TABLE IF NOT EXISTS wheel_on_rumble_strip_data (id INT PRIMARY KEY, leftFront INT, leftRear INT, rightFront INT, rightRear INT);',
  wheel_in_puddle_depth_data: 'CREATE TABLE IF NOT EXISTS wheel_in_puddle_depth_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT);',
  surface_rumble_data: 'CREATE TABLE IF NOT EXISTS surface_rumble_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT);',
  slip_angle_data: 'CREATE TABLE IF NOT EXISTS slip_angle_data (id INT PRIMARY KEY, leftFront FLOAT, leftRear FLOAT, rightFront FLOAT, rightRear FLOAT);',
}

export const InsertTelemetryCommands = {
  packets: 'INSERT INTO packets (id, json) VALUES (?, ?)',
  rpm_data: 'INSERT INTO rpm_data (id, max, idle, current) VALUES (?, ?, ?, ?)',
  acceleration_data: 'INSERT INTO acceleration_data (id, x, y, z) VALUES (?, ?, ?, ?)',
  velocity_data: 'INSERT INTO velocity_data (id, x, y, z) VALUES (?, ?, ?, ?)',
  angular_velocity_data: 'INSERT INTO angular_velocity_data (id, x, y, z) VALUES (?, ?, ?, ?)',
  orientation_data: 'INSERT INTO orientation_data (id, yaw, pitch, roll) VALUES (?, ?, ?, ?)',
  normalized_suspension_travel_data: 'INSERT INTO normalized_suspension_travel_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?, ?, ?, ?, ?)',
  tire_slip_ratio_data: 'INSERT INTO tire_slip_ratio_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?, ?, ?, ?, ?)',
  wheel_rotation_speed_data: 'INSERT INTO wheel_rotation_speed_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?, ?, ?, ?, ?)',
  wheel_on_rumble_strip_data: 'INSERT INTO wheel_on_rumble_strip_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?, ?, ?, ?, ?)',
  wheel_in_puddle_depth_data: 'INSERT INTO wheel_in_puddle_depth_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?, ?, ?, ?, ?)',
  surface_rumble_data: 'INSERT INTO surface_rumble_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?, ?, ?, ?, ?)',
  slip_angle_data: 'INSERT INTO slip_angle_data (id, leftFront, leftRear, rightFront, rightRear) VALUES (?, ?, ?, ?, ?)',
}