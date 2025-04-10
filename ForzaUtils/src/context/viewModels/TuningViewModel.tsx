import { Drivetrain } from "ForzaTelemetryApi";
import { useEffect, useState } from "react";

export enum EngineLayout {
  FRONT,
  REAR,
  MID
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
}

export function useTuningViewModel(): ITuningViewModel {
  const tag = 'TuningViewModel';
  const [weight, setWeight] = useState(3000);
  const [frontDist, setFrontDist] = useState(55);
  const [rearDist, setRearDist] = useState(46);
  const [rollCage, setRollCage] = useState(false);
  const [drivetrain, setDrivetrainType] = useState(Drivetrain.FWD);
  const [layout, setLayout] = useState(EngineLayout.FRONT);
  const [frontWeight, setFrontWeight] = useState(0);
  const [rearWeight, setRearWeight] = useState(0);
  const [frontCornerWeight, setFrontCornerWeight] = useState(0);
  const [rearCornerWeight, setRearCornerWeight] = useState(0);

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

  useEffect(() => {
    calculateFrontWeights();
    calculateRearWeights();
  }, [weight]);

  useEffect(() => {
    calculateFrontWeights();
  }, [frontDist]);

  useEffect(() => {
    calculateRearWeights();
  }, [rearDist]);

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
    drivetrain: drivetrain,
    setDrivetrain: (drivetrain) => {
      setDrivetrainType(drivetrain)
    },
    engineLayout: layout,
    setEngineLayout: (layout) => {
      setLayout(layout);
    },
    frontCornerWeight: frontCornerWeight,
    rearCornerWeight: rearCornerWeight,
    frontWeight: frontWeight,
    rearWeight: rearWeight
  }
}
