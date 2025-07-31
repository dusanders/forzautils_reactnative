import { Drivetrain } from "ForzaTelemetryApi";
import { AxleData } from "../../../constants/types";
import { ITuningCalculator, CalculatorParams, CalculatorResult, hzBase, EngineLayout, hzHighHeight, hzLowHeight } from "./Calculators";

export class Grok2Calculator implements ITuningCalculator {
  private boundScalar = 0.006;
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
      params.suspensionHz.front,
      params.frontAeroForce
    );
    result.springRates.rear = this.calculateSpringRate(
      weights.axle.rear,
      params.rideHeight.rear,
      params.suspensionHz.rear,
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
    return this.adjustForLayout(result, params);
  }

  calculateHzFromRideHeight(height: number): number {
    if (height <= 4.5) return hzLowHeight;
    if (height >= 6) return hzHighHeight;
    const rideHeightAdjust = (height - 2) * 0.1;
    const freq = hzBase - rideHeightAdjust;
    return freq;
  }

  private calculateSpringRate(axleWeight: number, height: number, hz: number, aero: number = 0): number {
    const rate = hz * ((axleWeight + aero) / (1.2 * height)); // Adjusted from 1.5 to 1.2 for stiffer springs
    const result = Number(rate.toFixed(2));
    return result;
  }

  private calculateAntiRollBar(
    springs: AxleData<number>,
    weightDist: AxleData<number>,
    arbBase: number = 20 // Increased from 15 to 20
  ): AxleData<number> {
    let frontARB = 0;
    let rearARB = 0;
    const totalSpring = springs.front + springs.rear;
    const frontSpringRatio = springs.front / totalSpring;
    const rearSpringRatio = springs.rear / totalSpring;
    const frontWeightScalar = (weightDist.front / 100) / 0.5;
    const rearWeightScalar = (weightDist.rear / 100) / 0.5;
    frontARB = arbBase * frontSpringRatio * 2.5 * frontWeightScalar; // Increased multiplier from 2 to 2.5
    rearARB = arbBase * rearSpringRatio * 2.5 * rearWeightScalar; // Increased multiplier from 2 to 2.5
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
  
  // Clamp damper values to the game's maximum slider value of 14
  const maxDamperValue = 14;
  result.bound.front = Math.min(result.bound.front, maxDamperValue);
  result.bound.rear = Math.min(result.bound.rear, maxDamperValue);
  result.rebound.front = Math.min(result.rebound.front, maxDamperValue);
  result.rebound.rear = Math.min(result.rebound.rear, maxDamperValue);
  
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

  private adjustForLayout(settings: CalculatorResult, input: CalculatorParams): CalculatorResult {
    switch (input.engineLayout) {
      case EngineLayout.FRONT:
        switch (input.drivetrain) {
          case Drivetrain.RWD:
            settings.springRates.rear *= 0.95;
            settings.damperBound.rear *= 0.95;
            settings.damperRebound.rear *= 0.95;
            settings.antiRollBar.rear *= 0.85;
            settings.antiRollBar.front *= 1.35;
            return settings;
          case Drivetrain.AWD:
            settings.springRates.rear *= 0.9;
            settings.damperBound.rear *= 0.9;
            settings.damperRebound.rear *= 0.9;
            return settings;
          case Drivetrain.FWD:
            return settings;
          default:
            return settings;
        }
      case EngineLayout.REAR:
        switch (input.drivetrain) {
          case Drivetrain.RWD:
            settings.springRates.front *= 0.9;
            settings.damperBound.front *= 0.9;
            settings.damperRebound.front *= 0.9;
            settings.antiRollBar.rear *= 0.75;
            settings.antiRollBar.front *= 1.45;
            return settings;
          case Drivetrain.AWD:
            settings.springRates.front *= 0.8;
            settings.damperBound.front *= 0.8;
            settings.damperRebound.front *= 0.8;
            return settings;
          case Drivetrain.FWD:
            settings.springRates.front *= 0.7;
            settings.damperBound.front *= 0.7;
            settings.damperRebound.front *= 0.7;
            return settings;
          default:
            return settings;
        }
      case EngineLayout.MID:
        switch (input.drivetrain) {
          case Drivetrain.RWD:
            settings.springRates.front *= 0.95;
            settings.damperBound.front *= 0.95;
            settings.damperRebound.front *= 0.95;
            settings.springRates.rear *= 0.95;
            settings.damperBound.rear *= 0.95;
            settings.damperRebound.rear *= 0.95;
            settings.antiRollBar.rear *= 0.85;
            settings.antiRollBar.front *= 1.35;
            return settings;
          case Drivetrain.AWD:
            settings.springRates.front *= 0.9;
            settings.damperBound.front *= 0.9;
            settings.damperRebound.front *= 0.9;
            settings.springRates.rear *= 0.9;
            settings.damperBound.rear *= 0.9;
            settings.damperRebound.rear *= 0.9;
            return settings;
          case Drivetrain.FWD:
            settings.springRates.front *= 0.85;
            settings.damperBound.front *= 0.85;
            settings.damperRebound.front *= 0.85;
            settings.springRates.rear *= 0.85;
            settings.damperBound.rear *= 0.85;
            settings.damperRebound.rear *= 0.85;
            return settings;
          default:
            return settings;
        }
      default:
        return settings;
    }
  }
}