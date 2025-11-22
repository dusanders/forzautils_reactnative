import React, { useEffect, useState } from "react";
import { CalculatorParams, CalculatorResult, CalculatorTypes, EngineLayout, hzBase, ITuningCalculator } from "./Calculators";
import { Grok2Calculator } from "./Grok2";
import { GrokCalculator } from "./GrokCalc";
import { SonnetCalculator } from "./Sonnet_37";
import { Logger } from "@/hooks/Logger";
import { Drivetrain } from "ForzaTelemetryApi";
import { useCache } from "@/services/Cache/Cache";

export interface TuningViewModelProps {
  initialCalculator?: CalculatorTypes;
  children?: React.ReactNode;
}

const TAG = "TuningViewModel";
const CACHE_KEY = "TuningViewModelState";
interface CachedTuningViewModelState {
  input: CalculatorParams;
  output: CalculatorResult;
  calculatorType: CalculatorTypes;
}
export interface ITuningViewModel extends ITuningCalculator {
  input: CalculatorParams;
  settings: CalculatorResult;
  setInput(params: CalculatorParams): void;
  calculatorType: CalculatorTypes;
  setCalculatorType(type: CalculatorTypes): void;
}

const TuningViewModelContext = React.createContext<ITuningViewModel | null>(null);

function shouldSaveInput(input: CalculatorParams): boolean {
  if(!input) {
    return false;
  }
  return input.totalWeight > 0 && input.suspensionHz.front > 0 && input.suspensionHz.rear > 0
    && input.rideHeight.front > 0 && input.rideHeight.rear > 0;
}
export function TuningViewModelProvider(props: TuningViewModelProps) {
  const cache = useCache();
  const [calculatorType, setCalculatorType] = React.useState<CalculatorTypes>(
    props.initialCalculator ?? CalculatorTypes.GROK2
  );
  const calculatorRef = React.useRef<ITuningCalculator>(new Grok2Calculator());

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

  const [output, setOutput] = useState<CalculatorResult>({
    springRates: { front: 0, rear: 0 },
    damperBound: { front: 0, rear: 0 },
    damperRebound: { front: 0, rear: 0 },
    antiRollBar: { front: 0, rear: 0 },
    cornerWeights: { front: 0, rear: 0 },
    axleWeights: { front: 0, rear: 0 }
  });

  useEffect(() => {
    if(!input) {
      return;
    }
    switch (calculatorType) {
      case CalculatorTypes.GROK:
        Logger.log(TAG, `Using Grok Calculator`);
        return setOutput(new GrokCalculator().calculate(input));
      case CalculatorTypes.SONNET:
        Logger.log(TAG, `Using Sonnet Calculator`);
        return setOutput(new SonnetCalculator().calculate(input));
      case CalculatorTypes.GROK2:
        Logger.log(TAG, `Using Grok2 Calculator`);
        return setOutput(new Grok2Calculator().calculate(input));
      default:
        Logger.warn(TAG, `Unknown calculator type: ${calculatorType}`);
        return setOutput(new GrokCalculator().calculate(input));
    }
  }, [input, calculatorType]);

  useEffect(() => {
    Logger.log(TAG, `Switching calculator to ${calculatorType}`);
    switch (calculatorType) {
      case CalculatorTypes.GROK2:
        calculatorRef.current = new Grok2Calculator();
        break;
      case CalculatorTypes.GROK:
        calculatorRef.current = new GrokCalculator();
        break;
      case CalculatorTypes.SONNET:
        calculatorRef.current = new SonnetCalculator();
        break;
      default:
        calculatorRef.current = new Grok2Calculator();
        break;
    }
  }, [calculatorType]);

  useEffect(() => {
    if (!shouldSaveInput(input)) {
      Logger.log(TAG, `Input has not changed, skipping cache update.`);
      return;
    }
    const state: CachedTuningViewModelState = {
      input,
      calculatorType,
      output
    };
    Logger.log(TAG, `Caching tuning view model state: ${JSON.stringify(state)}`);
    cache.setItem(CACHE_KEY, state);
  }, [input, calculatorType, output]);

  useEffect(() => {
    const loadCache = async () => {
      const cached = await cache.getItem<CachedTuningViewModelState>(CACHE_KEY);
      if (cached) {
        Logger.log(TAG, `Loaded cached tuning view model state: ${JSON.stringify(cached)}`);
        setInput(cached.input);
        setCalculatorType(cached.calculatorType);
        setOutput(cached.output);
      }
    }
    loadCache();
  }, [cache]);

  return (
    <TuningViewModelContext.Provider value={{
      input,
      settings: output,
      setInput: (params: CalculatorParams) => setInput(params),
      calculatorType,
      setCalculatorType,
      calculate: (params) => calculatorRef.current.calculate(params),
      calculateHzFromRideHeight: (params) => calculatorRef.current.calculateHzFromRideHeight(params),
    }} >
      {props.children}
    </TuningViewModelContext.Provider>
  )
}
export function useTuningViewModel(): ITuningViewModel {
  const context = React.useContext(TuningViewModelContext);
  if (!context) {
    throw new Error("useTuningViewModel must be used within a TuningViewModelProvider");
  }
  return context;
}
