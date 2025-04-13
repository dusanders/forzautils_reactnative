import { Drivetrain } from "ForzaTelemetryApi";
import { useEffect, useState } from "react";

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
let instance: ITuningViewModel | undefined;

export function useTuningViewModel(): ITuningViewModel {
  const tag = 'TuningViewModel';
  //#region State
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
  const [frontDist, setFrontDist] = useState(55);
  const [rearDist, setRearDist] = useState(46);
  const [rollCage, setRollCage] = useState(false);
  const [drivetrainType, setDrivetrainType] = useState(Drivetrain.FWD);
  const [layoutType, setLayout] = useState(EngineLayout.FRONT);
  const [frontWeight, setFrontWeight] = useState(0);
  const [rearWeight, setRearWeight] = useState(0);
  const [frontCornerWeight, setFrontCornerWeight] = useState(0);
  const [rearCornerWeight, setRearCornerWeight] = useState(0);
  const [frontRideHeight, setFrontRideHeight] = useState(5.5);
  const [rearRideHeight, setRearRideHeight] = useState(5.5);
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
  const calculateFrontWeights = () => {
    if (frontDist == 0) {
      setFrontWeight(0);
      setFrontCornerWeight(0);
      return;
    }
    const scalar = (frontDist / 100);
    setFrontWeight(weight * scalar);
    setFrontCornerWeight((weight * scalar) / 2);
  };
  const calculateRearWeights = () => {
    if (rearDist == 0) {
      setRearWeight(0);
      setRearCornerWeight(0);
      return;
    }
    const scalar = (rearDist / 100);
    setRearWeight(weight * scalar);
    setRearCornerWeight((weight * scalar) / 2);
  };
  const calculateTargetHz = (height: number) => {
    if (height <= 3.5) {
      return hzLowHeight
    } else if (height >= 6.0) {
      return hzHighHeight
    }
    return hzBase;
  };
  const adjustForLayout = (front: SuspensionSettings, rear: SuspensionSettings)
    : { front: SuspensionSettings, rear: SuspensionSettings } => {
    switch (layoutType) {
      case EngineLayout.FRONT:
        switch (drivetrainType) {
          case Drivetrain.FWD:
            front.bound *= 1.15;
            rear.bound *= 0.9;
            rear.rebound *= 0.9;
            front.ARB *= 1.15;
            rear.ARB += 0.85;
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

  //#endregion

  //#region Effects

  /**
   * Spring rates changed - update rear settings
   */
  useEffect(() => {
    const bound = (frontSprings * damperScalar);
    const rebound = (bound * reboundScalar);
    const arb = (
      (baseARB * (frontSprings / totalSprings) * 2)
      * ((frontDist / 100) / 0.5)
    )
    const adjusted = adjustForLayout({
      springRate: frontSprings,
      bound: rollCage ? bound * rollCageFrontBump : bound,
      rebound: rollCage ? rebound * rollCageFrontRebound : rebound,
      ARB: rollCage ? arb * rollCageFrontARB : arb
    }, rearSettings);
    setFrontSettings(adjusted.front);
  }, [frontHz, totalSprings, drivetrainType, layoutType, rollCage]);

  /**
   * Spring rates changed - update front settings
   */
  useEffect(() => {
    const bound = (rearSprings * damperScalar);
    const rebound = (bound * reboundScalar);
    const arb = (
      (baseARB * (rearSprings / totalSprings) * 2)
      * ((frontDist / 100) / 0.5)
    )
    const adjusted = adjustForLayout(frontSettings, {
      springRate: rearSprings,
      bound: rollCage ? bound * rollCageRearBump : bound,
      rebound: rollCage ? rebound * rollCageRearRebound : rebound,
      ARB: rollCage ? arb * rollCageRearARB : arb
    })
    setRearSettings(adjusted.rear);
  }, [rearHz, totalSprings, drivetrainType, layoutType, rollCage]);

  /**
   * Rear calcs have changed - update the spring rates
   */
  useEffect(() => {
    const rate = rearHz * (rearWeight / (2 * rearRideHeight));
    setRearSprings(rate);
    setTotalSprings(rate + frontSprings);
  }, [weight, rearRideHeight, rearWeight, rearHz]);

  /**
   * Front calcs have changed - update the spring rates
   */
  useEffect(() => {
    const rate = frontHz * (frontWeight / (2 * frontRideHeight));
    setFrontSprings(rate);
    setTotalSprings(rate + rearSprings);
  }, [weight, frontRideHeight, frontWeight, frontHz]);

  /**
   * Front ride height changed - update target Hz
   */
  useEffect(() => {
    setFrontHz(calculateTargetHz(frontRideHeight));
  }, [frontRideHeight]);

  /**
   * Rear ride height changed - update target Hz
   */
  useEffect(() => {
    setRearHz(calculateTargetHz(rearRideHeight));
  }, [rearRideHeight]);

  /**
   * Weight changed - recalc the front/rear weights
   */
  useEffect(() => {
    calculateFrontWeights();
    calculateRearWeights();
  }, [weight]);

  /**
   * Front distribution changed - recalc the front weights
   */
  useEffect(() => {
    calculateFrontWeights();
  }, [frontDist]);

  /**
   * Rear distribution changed - recalc the rear weights
   */
  useEffect(() => {
    calculateRearWeights();
  }, [rearDist]);

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
