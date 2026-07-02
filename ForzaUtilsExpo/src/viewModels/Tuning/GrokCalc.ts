import { Drivetrain } from "ForzaTelemetryApi";
import { ITuningCalculator, CalculatorParams, CalculatorResult, hzBase, EngineLayout, hzHighHeight, hzLowHeight, AxleData } from "./Calculators";

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
    const rate = hz * ((axleWeight + aero) / (1.5 * height));
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

  private adjustForLayout(settings: CalculatorResult, input: CalculatorParams): CalculatorResult {
    switch (input.engineLayout) {
      case EngineLayout.FRONT:
        switch (input.drivetrain) {
          case Drivetrain.RWD:
            // Adjust for RWD front engine
            settings.springRates.rear *= 0.95; // Slightly softer rear springs
            settings.damperBound.rear *= 0.95; // Slightly softer rear bound dampers
            settings.damperRebound.rear *= 0.95; // Slightly softer rear rebound dampers
            settings.antiRollBar.rear *= 0.85; // Slightly softer rear ARB
            settings.antiRollBar.front *= 1.35; // Slightly stiffer front ARB
            return settings;
          case Drivetrain.AWD:
            // Adjust for AWD front engine
            settings.springRates.rear *= 0.9; // Slightly softer rear springs
            settings.damperBound.rear *= 0.9; // Slightly softer rear bound dampers
            settings.damperRebound.rear *= 0.9; // Slightly softer rear rebound dampers
            return settings;
          case Drivetrain.FWD:
            // no adjustment needed for FWD front engine
            return settings;
          default:
            return settings;
        }
      case EngineLayout.REAR:
        switch (input.drivetrain) {
          case Drivetrain.RWD:
            // Adjust for RWD rear engine
            settings.springRates.front *= 0.9; // Slightly softer front springs
            settings.damperBound.front *= 0.9; // Slightly softer front bound dampers
            settings.damperRebound.front *= 0.9; // Slightly softer front rebound dampers
            settings.antiRollBar.rear *= 0.75; // Slightly softer rear ARB
            settings.antiRollBar.front *= 1.45; // Slightly stiffer front ARB
            return settings;
          case Drivetrain.AWD:
            // Adjust for AWD rear engine
            settings.springRates.front *= 0.8; // Softer front springs
            settings.damperBound.front *= 0.8; // Softer front bound dampers
            settings.damperRebound.front *= 0.8; // Softer front rebound dampers
            return settings;
          case Drivetrain.FWD:
            // Adjust for FWD rear engine
            settings.springRates.front *= 0.7; // Much softer front springs
            settings.damperBound.front *= 0.7; // Much softer front bound dampers
            settings.damperRebound.front *= 0.7; // Much softer front rebound dampers
            return settings;
          default:
            return settings;
        }
      case EngineLayout.MID:
        switch (input.drivetrain) {
          case Drivetrain.RWD:
            // Adjust for RWD mid engine  
            settings.springRates.front *= 0.95; // Slightly softer front springs
            settings.damperBound.front *= 0.95; // Slightly softer front bound dampers
            settings.damperRebound.front *= 0.95; // Slightly softer front rebound dampers
            settings.springRates.rear *= 0.95; // Slightly softer rear springs
            settings.damperBound.rear *= 0.95; // Slightly softer rear bound dampers
            settings.damperRebound.rear *= 0.95; // Slightly softer rear rebound dampers
            settings.antiRollBar.rear *= 0.85; // Slightly softer rear ARB
            settings.antiRollBar.front *= 1.35; // Slightly stiffer front ARB
            return settings;
          case Drivetrain.AWD:
            // Adjust for AWD mid engine
            settings.springRates.front *= 0.9; // Softer front springs
            settings.damperBound.front *= 0.9; // Softer front bound dampers
            settings.damperRebound.front *= 0.9; // Softer front rebound dampers
            settings.springRates.rear *= 0.9; // Softer rear springs
            settings.damperBound.rear *= 0.9; // Softer rear bound dampers
            settings.damperRebound.rear *= 0.9; // Softer rear rebound dampers
            return settings;
          case Drivetrain.FWD:
            // Adjust for FWD mid engine
            settings.springRates.front *= 0.85; // Softer front springs
            settings.damperBound.front *= 0.85; // Softer front bound dampers
            settings.damperRebound.front *= 0.85; // Softer front rebound dampers
            settings.springRates.rear *= 0.85; // Softer rear springs
            settings.damperBound.rear *= 0.85; // Softer rear bound dampers
            settings.damperRebound.rear *= 0.85; // Softer rear rebound dampers
            return settings;
          default:
            return settings;
        }
      default: return settings;
    }
  }
}