import React, { useEffect, useState } from "react";
import { CalculatorParams, CalculatorResult, CalculatorTypes, EngineLayout, hzBase, ITuningCalculator } from "./Calculators";
import { Grok2Calculator } from "./Grok2";
import { GrokCalculator } from "./GrokCalc";
import { SonnetCalculator } from "./Sonnet_37";
import { Logger } from "@/hooks/Logger";
import { Drivetrain } from "ForzaTelemetryApi";

export interface TuningViewModelProps {
  initialCalculator?: CalculatorTypes;
  children?: React.ReactNode;
}

export interface ITuningViewModel extends ITuningCalculator {
  input: CalculatorParams;
  settings: CalculatorResult;
  setInput(params: CalculatorParams): void;
  calculatorType: CalculatorTypes;
  setCalculatorType(type: CalculatorTypes): void;
}

const TuningViewModelContext = React.createContext<ITuningViewModel | null>(null);

export function TuningViewModelProvider(props: TuningViewModelProps) {
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
  const [settings, setSettings] = useState<CalculatorResult>({
    springRates: { front: 0, rear: 0 },
    damperBound: { front: 0, rear: 0 },
    damperRebound: { front: 0, rear: 0 },
    antiRollBar: { front: 0, rear: 0 },
    cornerWeights: { front: 0, rear: 0 },
    axleWeights: { front: 0, rear: 0 }
  });

  useEffect(() => {
    Logger.log("TuningViewModel", `Switching calculator to ${calculatorType}`);
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

  return (
    <TuningViewModelContext.Provider value={{
      input,
      settings,
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
