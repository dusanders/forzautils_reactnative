import { Drivetrain } from "ForzaTelemetryApi";
import { useEffect, useState } from "react";
import { useCache } from "../../Cache";
import { useLogger } from "../../Logger";
import { CalculatorParams, CalculatorResult, CalculatorTypes, EngineLayout, hzBase, ITuningCalculator } from "./Calculators";
import { AxleData, ICache } from "../../../types/types";
import { GrokCalculator } from "./GrokCalc";
import { SonnetCalculator } from "./Sonnet_37";
import { Grok2Calculator } from "./Grok2";

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
  settings: CalculatorResult;
  setInput(params: CalculatorParams): void;
  calculatorType: CalculatorTypes;
  setCalculatorType(type: CalculatorTypes): void;
}

function isTuningViewModel(obj: any): obj is ITuningViewModel {
  return 'input' in obj && 'settings' in obj;
}

export function useTuningViewModel(): ITuningViewModel {
  const tag = 'TuningViewModel';
  const logger = useLogger();
  const [calculatorType, setCalculatorType] = useState<CalculatorTypes>(CalculatorTypes.GROK);

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
      calculatorType: calculatorType
    }
    cache.setItem(tag, cacheModel);
  }

  //#region Effects

  useEffect(() => {
    const tryCache = async () => {
      const found = await cache.getItem<ICache<ITuningViewModel>>(tag);
      if(found && isTuningViewModel(found)) {
        // logger.log(tag, `found cache: ${JSON.stringify(found)}`);
        setInput(found.input);
        setSettings(found.settings);
        if(found.calculatorType) {
          setCalculatorType(found.calculatorType);
        }
      }
    }
    tryCache();
  }, [cache]);

  useEffect(() => {
    updateCache();
  }, [input, settings, calculatorType]);

  useEffect(() => {
    switch (calculatorType) {
      case CalculatorTypes.GROK:
        logger.log(tag, `Using Grok Calculator`);
        return setSettings(new GrokCalculator().calculate(input));
      case CalculatorTypes.SONNET:
        logger.log(tag, `Using Sonnet Calculator`);
        return setSettings(new SonnetCalculator().calculate(input));
      case CalculatorTypes.GROK2:
        logger.log(tag, `Using Grok2 Calculator`);
        return setSettings(new Grok2Calculator().calculate(input));
      default:
        logger.warn(tag, `Unknown calculator type: ${calculatorType}`);
        return setSettings(new GrokCalculator().calculate(input));
    }
  }, [input, calculatorType, logger]);

  //#endregion

  return {
    input,
    setInput,
    settings,
    calculatorType,
    setCalculatorType,
  }
}
