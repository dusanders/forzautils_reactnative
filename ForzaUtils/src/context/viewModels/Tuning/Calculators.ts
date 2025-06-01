import { Drivetrain } from "ForzaTelemetryApi";
import { AxleData } from "../../../constants/types";

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

const hzLowHeight = 2.7;
export const hzBase = 2.4;
const hzHighHeight = 2;

export class GrokCalculator implements ITuningCalculator {
  private boundScalar = 0.011;
  private reboundScalar = 1.55;

  calculate(params: CalculatorParams): CalculatorResult {
    const result: CalculatorResult = {
      springRates: {
        front: 0,
        rear: 0,
      },
      damperBound: {
        front: 0,
        rear: 0,
      },
      damperRebound: {
        front: 0,
        rear: 0,
      },
      antiRollBar: {
        front: 0,
        rear: 0,
      },
      axleWeights: {
        front: 0,
        rear: 0,
      },
      cornerWeights: {
        front: 0,
        rear: 0,
      }
    };
    const weights = this.calculateWeights(
      params.totalWeight,
      params.frontWeightDistribution
    );
    result.axleWeights = weights.axle;
    result.cornerWeights = weights.corners;
    result.springRates.front = this.calculateSpringRate(
      weights.axle.front,
      params.rideHeight.front,
      params.frontAeroForce
    );
    result.springRates.rear = this.calculateSpringRate(
      weights.axle.rear,
      params.rideHeight.rear,
      params.rearAeroForce
    );
    result.antiRollBar = this.calculateAntiRollBar(
      result.springRates,
      {
        front: params.frontWeightDistribution,
        rear: 100 - params.frontWeightDistribution
      },
    );
    const dampers = this.calculateDampers(result.springRates);
    result.damperBound = dampers.bound;
    result.damperRebound = dampers.rebound;
    return result;
  }

  calculateHzFromRideHeight(height: number): number {
    if (height <= 2) return hzLowHeight;
    if (height >= 6) return hzHighHeight;
    const rideHeightAdjust = (height - 2) * 0.1;
    const freq = hzBase - rideHeightAdjust;
    return freq;
  }

  private calculateSpringRate(axleWeight: number, height: number, aero: number = 0): number {
    const rate = this.calculateHzFromRideHeight(height) * ((axleWeight + aero) / (1.5 * height));
    const result = Number(rate.toFixed(2));
    return result;
  }

  private calculateAntiRollBar(
    springs: AxleData<number>,
    weightDist: AxleData<number>,
    arbBase: number = 15
  ): AxleData<number> {
    let frontARB = 0;
    let rearARB = 0;
    const totalSpring = springs.front + springs.rear;
    const frontSpringRatio = springs.front / totalSpring;
    const rearSpringRatio = springs.rear / totalSpring;
    const frontWeightScalar = (weightDist.front / 100) / 0.5;
    const rearWeightScalar = (weightDist.rear / 100) / 0.5;
    frontARB = arbBase * frontSpringRatio * 2 * frontWeightScalar;
    rearARB = arbBase * rearSpringRatio * 2 * rearWeightScalar;
    return {
      front: Number(frontARB.toFixed(2)),
      rear: Number(rearARB.toFixed(2))
    }
  }

  private calculateDampers(springs: AxleData<number>): {
    bound: AxleData<number>;
    rebound: AxleData<number>;
  } {
    const result = {
      bound: {
        front: 0,
        rear: 0, 
      },
      rebound: {
        front: 0,
        rear: 0,
      }
    };
    result.bound.front = Number((this.boundScalar * springs.front).toFixed(2));
    result.bound.rear = Number((this.boundScalar * springs.rear).toFixed(2));
    result.rebound.front = Number((this.reboundScalar * result.bound.front).toFixed(2));
    result.rebound.rear = Number((this.reboundScalar * result.bound.rear).toFixed(2));
    return result;
  }

  private calculateWeights(total: number, frontDist: number): {
    axle: AxleData<number>;
    corners: AxleData<number>;
  } {
    const frontAxle = total * (frontDist / 100);
    const rearAxle = total * ((100 - frontDist) / 100);
    const result = {
      axle: {
        front: frontAxle,
        rear: rearAxle,
      },
      corners: {
        front: frontAxle / 2,
        rear: rearAxle / 2,
      }
    };
    return result;
  }
}