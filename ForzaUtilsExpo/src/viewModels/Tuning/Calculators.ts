import { Drivetrain } from "ForzaTelemetryApi";

/**
 * Add type for generic axle data
 * @template T Type of data for the axle
 * @property front Data for the front axle
 * @property rear Data for the rear axle
 */
export interface AxleData<T> {
  front: T;
  rear: T;
}

export enum CalculatorTypes {
  GROK = "Grok",
  GROK2 = "Grok2",
  SONNET = "Sonnet"
}

export enum EngineLayout {
  FRONT,
  REAR,
  MID
}

export interface CalculatorParams {
  hasRollCage: boolean;
  totalWeight: number;
  frontWeightDistribution: number;
  frontAeroForce: number;
  rearAeroForce: number;
  rideHeight: AxleData<number>;
  suspensionHz: AxleData<number>;
  engineLayout: EngineLayout;
  drivetrain: Drivetrain;
}

export interface CalculatorResult {
  springRates: AxleData<number>;
  damperBound: AxleData<number>;
  damperRebound: AxleData<number>;
  antiRollBar: AxleData<number>;
  cornerWeights: AxleData<number>;
  axleWeights: AxleData<number>;
}

export interface ITuningCalculator {
  calculate(params: CalculatorParams): CalculatorResult;
  calculateHzFromRideHeight(height: number): number;
}

export const hzLowHeight = 2.7;
export const hzBase = 2.4;
export const hzHighHeight = 2;
