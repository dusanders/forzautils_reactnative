import { Drivetrain } from "ForzaTelemetryApi";
import { useEffect, useState } from "react";
import { ICache, useCache } from "../Cache";
import { useLogger } from "../Logger";

export enum EngineLayout {
  FRONT,
  REAR,
  MID
}

export interface SuspensionSettings {
  springRate: number;
  rebound: number;
  bound: number;
  ARB: number;
}

export interface WeightsState {
  frontAxle: number;
  rearAxle: number;
  frontCorner: number;
  rearCorner: number;
}

export interface ITuningViewModel {
  totalVehicleWeight: number;
  setTotalVehicleWeight(weight: number): void;
  frontDistribution: number;
  setFrontDistribution(percent: number): void;
  rearDistribution: number;
  hasRollCage: boolean;
  setHasRollCage(hasCage: boolean): void;
  drivetrain: Drivetrain;
  setDrivetrain(drivetrain: Drivetrain): void;
  engineLayout: EngineLayout;
  setEngineLayout(layout: EngineLayout): void;
  weights: WeightsState;
  frontHeight: number;
  setFrontHeight(height: number): void;
  rearHeight: number;
  setRearHeight(height: number): void;
  frontHz: number;
  setFrontHz(hz: number): void;
  rearHz: number;
  setRearHz(hz: number): void;
  frontSettings: SuspensionSettings;
  rearSettings: SuspensionSettings;
}

export function useTuningViewModel(): ITuningViewModel {
  const tag = 'TuningViewModel';
  const logger = useLogger();
  //#region State

  const cache = useCache();
  const defaultDamper: SuspensionSettings = {
    rebound: 0,
    bound: 0,
    springRate: 0,
    ARB: 0
  }
  const hzLowHeight = 2.8;
  const hzBase = 2.2;
  const hzHighHeight = 1.8;
  const baseARB = 20;
  const minARB = 1;
  const maxARB = 40;
  const damperScalar = 0.011;
  const reboundScalar = 1.55;
  const maxDamper = 14;
  const rollCageBump = 0.95;
  const rollCageRebound = 1.05;
  const rollCageARB = 0.75;
  const [totalWeight, setTotalWeight] = useState(3000);
  const [frontDist, setFrontDist] = useState(53);
  const [rearDist, setRearDist] = useState(47);
  const [rollCage, setRollCage] = useState(false);
  const [drivetrainType, setDrivetrainType] = useState(Drivetrain.FWD);
  const [layoutType, setLayout] = useState(EngineLayout.FRONT);
  const [weights, setWeights] = useState<WeightsState>({
    frontAxle: 0,
    rearAxle: 0,
    frontCorner: 0,
    rearCorner: 0
  });
  const [frontRideHeight, setFrontRideHeight] = useState(4.0);
  const [rearRideHeight, setRearRideHeight] = useState(4.0);
  const [frontHz, setFrontHz] = useState(hzBase);
  const [rearHz, setRearHz] = useState(hzBase);

  //#endregion

  //#region Helpers

  const calculateFreqHz = (height: number) => {
    if (height <= 2) return hzLowHeight;
    if (height >= 6) return hzHighHeight;
    const freq = hzLowHeight - 0.2 * (height - 2);
    return freq;
  }
  const calculateSpring = (axleWeight: number, height: number) => {
    const rate = calculateFreqHz(height) * (axleWeight / (2 * height));
    const result = Number(rate.toFixed(2));
    return result;
  }
  const calculateArb = (
    springs: { front: number, rear: number },
    weightDist: { front: number, rear: number },
    arbBase: number
  ): { front: number, rear: number } => {
    let frontARB = 0;
    let rearARB = 0;
    const totalSpring = springs.front + springs.rear;
    const frontSpringRatio = springs.front / totalSpring;
    const rearSpringRatio = springs.rear / totalSpring;
    frontARB = arbBase * frontSpringRatio * ((weightDist.front / 100) / 0.5);
    rearARB = arbBase * rearSpringRatio * ((weightDist.rear / 100) / 0.5);
    return {
      front: Number(frontARB.toFixed(2)),
      rear: Number(rearARB.toFixed(2))
    }
  }
  const calculateDampers = (springs: { front: number, rear: number })
    : {
      front: { bump: number, rebound: number },
      rear: { bump: number, rebound: number }
    } => {
    let result = {
      front: { bump: 0, rebound: 0 },
      rear: { bump: 0, rebound: 0 }
    };
    result.front.bump = damperScalar * springs.front;
    result.rear.bump = damperScalar * springs.rear;
    result.front.rebound = reboundScalar * result.front.bump;
    result.rear.rebound = reboundScalar * result.rear.bump;
    return result;
  }
  const calculateWeight = (total: number, frontDistribution: number): WeightsState => {
    if (total == 0) {
      return weights;
    }
    const rearDist = (100 - frontDistribution);
    const frontAxle = total * (frontDist / 100);
    const rearAxle = total * (rearDist / 100);
    const frontCorner = frontAxle / 2;
    const rearCorner = rearAxle / 2;
    return {
      frontAxle: frontAxle,
      rearAxle: rearAxle,
      frontCorner: frontCorner,
      rearCorner: rearCorner
    }
  }
  const adjustForLayout = (front: SuspensionSettings, rear: SuspensionSettings)
    : { front: SuspensionSettings, rear: SuspensionSettings } => {
    switch (layoutType) {
      case EngineLayout.FRONT:
        switch (drivetrainType) {
          case Drivetrain.FWD:
            front.bound *= 1.15;
            rear.bound *= 0.9;
            rear.rebound *= 0.9;
            front.ARB *= 0.85;
            rear.ARB += 1.15;
            break;
          case Drivetrain.RWD:
            front.rebound *= 0.9;
            rear.rebound *= 1.05;
            front.ARB *= 1.1;
            rear.ARB *= 0.8;
            break;
          case Drivetrain.AWD:
            front.bound *= 1.1;
            rear.rebound *= 0.95;
            front.ARB *= 0.95;
            rear.ARB *= 1.1;
            break;
        }
        break;
      case EngineLayout.MID:
        switch (drivetrainType) {
          case Drivetrain.FWD:
            front.bound *= 1.1;
            rear.rebound *= 0.9;
            front.ARB *= 1.1;
            rear.ARB *= 0.9;
            break;
          case Drivetrain.RWD:
            front.rebound *= 0.95;
            rear.rebound *= 1.05;
            front.ARB *= 0.95;
            rear.ARB *= 0.85;
            break;
          case Drivetrain.AWD:
            front.ARB *= 1.05;
            break;
        }
        break;
      case EngineLayout.REAR:
        switch (drivetrainType) {
          case Drivetrain.FWD:
            front.bound *= 1.1;
            rear.rebound *= 0.9;
            front.ARB *= 1.1;
            rear.ARB *= 0.9;
            break;
          case Drivetrain.RWD:
            front.rebound *= 0.9;
            rear.bound *= 1.05;
            rear.rebound *= 1.1;
            front.ARB *= 0.95;
            rear.ARB *= 0.65;
            break;
          case Drivetrain.AWD:
            front.rebound *= 0.95;
            rear.rebound *= 1.1;
            front.ARB *= 0.95;
            rear.ARB *= 1.05;
            break;
        }
        break;
    }
    if (rollCage) {
      front.bound *= rollCageBump;
      front.rebound *= rollCageRebound;
      front.ARB *= rollCageARB;
      rear.bound *= rollCageBump;
      rear.rebound *= rollCageRebound;
      rear.ARB *= rollCageARB;
    }
    front.ARB = Math.max(minARB, Math.min(maxARB, front.ARB));
    rear.ARB = Math.max(minARB, Math.min(maxARB, rear.ARB));
    return {
      front: front,
      rear: rear
    };
  }
  const updateCache = () => {
    const cacheModel: ICache<ITuningViewModel> = {
      totalVehicleWeight: totalWeight,
      frontDistribution: frontDist,
      rearDistribution: rearDist,
      hasRollCage: rollCage,
      drivetrain: drivetrainType,
      engineLayout: layoutType,
      frontHeight: frontRideHeight,
      rearHeight: rearRideHeight,
      frontHz: frontHz,
      rearHz: rearHz,
      weights: weights,
      frontSettings: {} as any,
      rearSettings: {} as any
    }
    cache.setItem(tag, cacheModel);
  }
  const calculateSuspensionSettings = (): {
    front: SuspensionSettings,
    rear: SuspensionSettings
  } => {
    const rates = {
      front: calculateSpring(weights.frontAxle, frontRideHeight),
      rear: calculateSpring(weights.rearAxle, rearRideHeight)
    };
    const arbs = calculateArb(
      rates,
      { front: frontDist, rear: rearDist },
      baseARB
    );
    const dampers = calculateDampers(rates);
    return {
      front: {
        springRate: rates.front,
        bound: dampers.front.bump,
        rebound: dampers.front.rebound,
        ARB: arbs.front
      },
      rear: {
        springRate: rates.rear,
        bound: dampers.rear.bump,
        rebound: dampers.rear.rebound,
        ARB: arbs.rear
      }
    }
  };

  //#endregion

  //#region Effects

  useEffect(() => {
    const tryCache = async () => {
      const found = await cache.getItem<ICache<ITuningViewModel>>(tag);
      if (found) {
        logger.log(tag, `found cache: ${JSON.stringify(found)}`);
        setTotalWeight(found.totalVehicleWeight);
        setFrontDist(found.frontDistribution);
        setRearDist(found.rearDistribution);
        setRollCage(found.hasRollCage);
        setDrivetrainType(found.drivetrain);
        setLayout(found.engineLayout);
        setFrontRideHeight(found.frontHeight);
        setRearRideHeight(found.rearHeight);
        setFrontHz(found.frontHz);
        setRearHz(found.rearHz);
      }
    }
    tryCache();
  }, [cache]);

  useEffect(() => {
    updateCache();
  }, [totalWeight, frontDist, rollCage, layoutType, drivetrainType, rearRideHeight, frontRideHeight]);

  /**
   * Weight changed - recalc the front/rear weights
   */
  useEffect(() => {
    const weights = calculateWeight(totalWeight, frontDist);
    setWeights(weights);
  }, [totalWeight, frontDist]);

  //#endregion

  return {
    totalVehicleWeight: totalWeight,
    setTotalVehicleWeight: (weight) => {
      setTotalWeight(weight)
    },
    frontDistribution: frontDist,
    setFrontDistribution: (percent) => {
      setFrontDist(percent);
      setRearDist(100 - percent);
    },
    rearDistribution: rearDist,
    hasRollCage: rollCage,
    setHasRollCage: (cage) => {
      setRollCage(cage)
    },
    drivetrain: drivetrainType,
    setDrivetrain: (drivetrain) => {
      setDrivetrainType(drivetrain)
    },
    engineLayout: layoutType,
    setEngineLayout: (layout) => {
      setLayout(layout);
    },
    frontHeight: frontRideHeight,
    setFrontHeight: (height) => {
      setFrontRideHeight(height);
    },
    rearHeight: rearRideHeight,
    setRearHeight: (height) => {
      setRearRideHeight(height);
    },
    frontHz: frontHz,
    setFrontHz: (hz) => {
      setFrontHz(hz);
    },
    rearHz: rearHz,
    setRearHz: (hz) => {
      setRearHz(hz);
    },
    weights: weights,
    frontSettings: adjustForLayout(calculateSuspensionSettings().front, calculateSuspensionSettings().rear).front,
    rearSettings: adjustForLayout(calculateSuspensionSettings().front, calculateSuspensionSettings().rear).rear
  }
}
