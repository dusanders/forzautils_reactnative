import { Drivetrain } from "ForzaTelemetryApi";
import { useEffect, useState } from "react";
import { ICache, useCache } from "../Cache";

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

export interface ITuningViewModel {
  totalVehicleWeight: number;
  setTotalVehicleWeight(weight: number): void;
  frontDistribution: number;
  setFrontDistribution(percent: number): void;
  rearDistribution: number;
  setRearDistribution(percent: number): void;
  hasRollCage: boolean;
  setHasRollCage(hasCage: boolean): void;
  drivetrain: Drivetrain;
  setDrivetrain(drivetrain: Drivetrain): void;
  engineLayout: EngineLayout;
  setEngineLayout(layout: EngineLayout): void;
  frontWeight: number;
  rearWeight: number;
  frontCornerWeight: number;
  rearCornerWeight: number;
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

  //#region State

  const cache = useCache();
  const defaultDamper: SuspensionSettings = {
    rebound: 0,
    bound: 0,
    springRate: 0,
    ARB: 0
  }
  const hzLowHeight = 3.2;
  const hzBase = 2.6;
  const hzHighHeight = 1.8;
  const rollCageFrontBump = 1.05;
  const rollCageRearBump = 1.05;
  const rollCageFrontRebound = 1.05;
  const rollCageRearRebound = 1.05;
  const rollCageFrontARB = 0.85;
  const rollCageRearARB = 0.85;
  const damperScalar = 0.011;
  const reboundScalar = 1.5;
  const baseARB = 15;
  const [weight, setWeight] = useState(3000);
  const [frontDist, setFrontDist] = useState(53);
  const [rearDist, setRearDist] = useState(47);
  const [rollCage, setRollCage] = useState(false);
  const [drivetrainType, setDrivetrainType] = useState(Drivetrain.FWD);
  const [layoutType, setLayout] = useState(EngineLayout.FRONT);
  const [frontWeight, setFrontWeight] = useState(0);
  const [rearWeight, setRearWeight] = useState(0);
  const [frontCornerWeight, setFrontCornerWeight] = useState(0);
  const [rearCornerWeight, setRearCornerWeight] = useState(0);
  const [frontRideHeight, setFrontRideHeight] = useState(4.0);
  const [rearRideHeight, setRearRideHeight] = useState(4.0);
  const [frontHz, setFrontHz] = useState(hzBase);
  const [rearHz, setRearHz] = useState(hzBase);
  const [frontSettings, setFrontSettings] = useState(defaultDamper);
  const [rearSettings, setRearSettings] = useState(defaultDamper);
  const [frontSprings, setFrontSprings] = useState(0);
  const [rearSprings, setRearSprings] = useState(0);
  const [totalSprings, setTotalSprings] = useState(0);

  //#endregion

  //#region Helpers

  const updateWeight = (value: number) => {
    console.log(tag, `update weight: ${value}`);
    setWeight(value);
  };
  const updateFrontDist = (value: number) => {
    setFrontDist(value);
    setRearDist(100 - value);
  };
  const updateRearDist = (value: number) => {
    setRearDist(value);
    setFrontDist(100 - value);
  };
  const calculateWeight = (total: number, distribution: number) => {
    if (total == 0) {
      return 0;
    }
    return (total * (distribution / 100));
  }
  const calculateTargetHz = (height: number) => {
    if (height <= 3.5) {
      return hzLowHeight
    } else if (height >= 6.0) {
      return hzHighHeight
    }
    return hzBase;
  };
  const calculateARB = (springRate: number, totalSpringRate: number, weightDist: number) => {
    const springDist = springRate / totalSpringRate;
    const base = baseARB * springDist * 2;
    const axleSplit = ((weightDist / 100) / 0.5);
    return base * axleSplit;
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
            front.ARB *= 0.9;
            rear.ARB *= 1.05;
            break;
          case Drivetrain.AWD:
            front.bound *= 1.1;
            rear.rebound *= 0.95;
            front.ARB *= 1.1;
            rear.ARB *= 0.95;
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
            rear.ARB *= 1.05;
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
            front.ARB *= 0.85;
            rear.ARB *= 1.1;
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
    return {
      front: front,
      rear: rear
    };
  }
  const getCacheModel = (): ICache<ITuningViewModel> => {
    return {
      totalVehicleWeight: weight,
      frontDistribution: frontDist,
      rearDistribution: rearDist,
      hasRollCage: rollCage,
      drivetrain: drivetrainType,
      engineLayout: layoutType,
      frontHeight: frontRideHeight,
      rearHeight: rearRideHeight,
      frontHz: frontHz,
      rearHz: rearHz,
      frontCornerWeight: frontCornerWeight,
      rearCornerWeight: rearCornerWeight,
      frontWeight: frontWeight,
      rearWeight: rearWeight,
      frontSettings: frontSettings,
      rearSettings: rearSettings
    }
  }

  //#endregion

  //#region Effects

  useEffect(() => {
    const tryCache = async () => {
      const found = await cache.getItem<ICache<ITuningViewModel>>(tag);
      if (found) {
        console.log(tag, `found cached tuning settings`);
        setWeight(found.totalVehicleWeight);
        setFrontDist(found.frontDistribution);
        setRearDist(found.rearDistribution);
        setRollCage(found.hasRollCage);
        setDrivetrainType(found.drivetrain);
        setLayout(found.engineLayout);
        setFrontRideHeight(found.frontHeight);
        setRearRideHeight(found.rearHeight);
        setFrontHz(found.frontHz);
        setRearHz(found.rearHz);
      } else {
        console.log(tag, `no cached tuning settings found`)
      }
    }
    tryCache();
  }, [cache]);

  /**
   * Spring rates changed - update rear settings
   */
  useEffect(() => {
    const bound = (frontSprings * damperScalar);
    const rebound = (bound * reboundScalar);
    const arb = calculateARB(frontSprings, totalSprings, frontDist);
    const adjusted = adjustForLayout({
      springRate: frontSprings,
      bound: rollCage ? bound * rollCageFrontBump : bound,
      rebound: rollCage ? rebound * rollCageFrontRebound : rebound,
      ARB: rollCage ? arb * rollCageFrontARB : arb
    }, rearSettings);
    setFrontSettings(adjusted.front);
    cache.setItem<ICache<ITuningViewModel>>(tag, getCacheModel());
  }, [frontSprings, totalSprings, drivetrainType, layoutType, rollCage]);

  /**
   * Spring rates changed - update front settings
   */
  useEffect(() => {
    const bound = (rearSprings * damperScalar);
    const rebound = (bound * reboundScalar);
    const arb = calculateARB(rearSprings, totalSprings, rearDist);
    const adjusted = adjustForLayout(frontSettings, {
      springRate: rearSprings,
      bound: rollCage ? bound * rollCageRearBump : bound,
      rebound: rollCage ? rebound * rollCageRearRebound : rebound,
      ARB: rollCage ? arb * rollCageRearARB : arb
    })
    setRearSettings(adjusted.rear);
    cache.setItem<ICache<ITuningViewModel>>(tag, getCacheModel());
  }, [rearSprings, totalSprings, drivetrainType, layoutType, rollCage]);

  /**
   * Front ride height changed - update target Hz
   */
  useEffect(() => {
    const hz = calculateTargetHz(frontRideHeight);
    const rate = hz * (frontWeight / (2 * frontRideHeight));
    setFrontSprings(rate);
    setTotalSprings(rate + rearSprings);
    setFrontHz(hz);
  }, [frontRideHeight, frontWeight, rearSprings]);

  /**
   * Rear ride height changed - update target Hz
   */
  useEffect(() => {
    const hz = calculateTargetHz(rearRideHeight);
    const rate = hz * (rearWeight / (2 * rearRideHeight));
    setRearSprings(rate);
    setTotalSprings(rate + frontSprings);
    setRearHz(hz);
  }, [rearRideHeight, rearWeight, frontSprings]);

  /**
   * Weight changed - recalc the front/rear weights
   */
  useEffect(() => {
    const frontWeight = calculateWeight(weight, frontDist);
    const rearWeight = calculateWeight(weight, rearDist);
    setFrontWeight(frontWeight);
    setRearWeight(rearWeight);
    setFrontCornerWeight(frontWeight / 2);
    setRearCornerWeight(rearWeight / 2);
  }, [weight, frontDist, rearDist]);

  //#endregion

  return {
    totalVehicleWeight: weight,
    setTotalVehicleWeight: (weight) => {
      updateWeight(weight)
    },
    frontDistribution: frontDist,
    setFrontDistribution: (percent) => {
      updateFrontDist(percent)
    },
    rearDistribution: rearDist,
    setRearDistribution: (percent) => {
      updateRearDist(percent)
    },
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
    frontCornerWeight: frontCornerWeight,
    rearCornerWeight: rearCornerWeight,
    frontWeight: frontWeight,
    rearWeight: rearWeight,
    frontSettings: frontSettings,
    rearSettings: rearSettings
  }
}
