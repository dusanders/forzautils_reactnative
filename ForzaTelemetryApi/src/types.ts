export interface RpmData {
  max: number;
  current: number;
  idle: number;
}
export interface DirectionalData {
  x: number;
  y: number;
  z: number;
}
export interface TireData {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
}
export interface CarInfo {
  ordinalId: number;
  class: CarClass;
  performanceIndex: number;
  drivetrainType: Drivetrain;
  numberOfCylinders: number;
  carType: string;
}
export enum CarClass {
  E, D, C, B, A, S, S1, S2, R, P, X
}
export enum Drivetrain {
  FWD, RWD, AWD
}