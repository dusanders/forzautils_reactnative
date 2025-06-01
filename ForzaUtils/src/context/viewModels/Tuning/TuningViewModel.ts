import { Drivetrain } from "ForzaTelemetryApi";
import { useEffect, useState } from "react";
import { ICache, useCache } from "../../Cache";
import { useLogger } from "../../Logger";
import { CalculatorParams, CalculatorResult, EngineLayout, GrokCalculator, hzBase } from "./Calculators";
import { AxleData } from "../../../constants/types";

export interface SuspensionSettings {
  springRate: number;
  rebound: number;
  bound: number;
  ARB: number;
}

export interface WeightsState {
  axleWeights: AxleData<number>;
  cornerWeights: AxleData<number>;
}

export interface ITuningViewModel {
  input: CalculatorParams;
  setInput(params: CalculatorParams): void;
  settings: CalculatorResult;
}

function isTuningViewModel(obj: any): obj is ITuningViewModel {
  return 'input' in obj && 'settings' in obj;
}

export function useTuningViewModel(): ITuningViewModel {
  const tag = 'TuningViewModel';
  const logger = useLogger();

  //#region State

  const cache = useCache();
  const [input, setInput] = useState<CalculatorParams>({
    hasRollCage: false,
    totalWeight: 0,
    frontWeightDistribution: 50,
    frontAeroForce: 0,
    rearAeroForce: 0,
    rideHeight: {
      front: 0,
      rear: 0
    },
    suspensionHz: {
      front: hzBase,
      rear: hzBase
    },
    engineLayout: EngineLayout.FRONT,
    drivetrain: Drivetrain.RWD
  });
  const [settings, setSettings] = useState<CalculatorResult>({
    springRates: { front: 0, rear: 0 },
    damperBound: { front: 0, rear: 0 },
    damperRebound: { front: 0, rear: 0 },
    antiRollBar: { front: 0, rear: 0 },
    cornerWeights: { front: 0, rear: 0 },
    axleWeights: { front: 0, rear: 0 }
  });

  //#endregion

  const updateCache = () => {
    const cacheModel: ICache<ITuningViewModel> = {
      input: input,
      settings: settings,
    }
    cache.setItem(tag, cacheModel);
  }

  //#region Effects

  useEffect(() => {
    const tryCache = async () => {
      const found = await cache.getItem<ICache<ITuningViewModel>>(tag);
      if(found && isTuningViewModel(found)) {
        logger.log(tag, `found cache: ${JSON.stringify(found)}`);
        setInput(found.input);
        setSettings(found.settings);
      }
    }
    tryCache();
  }, [cache]);

  useEffect(() => {
    updateCache();
  }, [input, settings]);

  useEffect(() => {
    const settings = new GrokCalculator().calculate(input);
    setSettings(settings);
  }, [input]);

  //#endregion

  return {
    input,
    setInput,
    settings,
  }
}
