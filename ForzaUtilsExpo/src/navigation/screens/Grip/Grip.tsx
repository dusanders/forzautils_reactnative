import React, { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { BrakeThrottleChart, BrakeThrottleChartProps } from "./BrakeThrottleChart";
import { SteeringChart } from "./SteeringChart";
import { TireSlip } from "./TireSlip";
import { ScrollView } from "react-native";
import { TireData } from "ForzaTelemetryApi";
import { MainAppNavigation } from "@/navigation/types";
import { useGripViewModel } from "@/viewModels/Grip/GripViewModel";
import { AppBarContainer } from "@/components/AppBar/AppBarContainer";
import { SlipAngle } from "@/components/Graphs/SlipAngle";

export interface GripProps {
  // Nothing
}

export function Grip(props: GripProps) {
  const navigation = useNavigation<MainAppNavigation>();
  const viewModel = useGripViewModel();
  const brakeThrottle = useMemo<BrakeThrottleChartProps>(() => {
    return {
      brake: viewModel.brake,
      throttle: viewModel.throttle
    }
  }, [viewModel.brake, viewModel.throttle]);

  const steering = useMemo<number>(() => {
    return viewModel.steering;
  }, [viewModel.steering]);

  const tireSlipData = useMemo<TireData>(() => {
    return viewModel.slipRatio
  }, [viewModel.slipRatio])

  return (
    <AppBarContainer
      title="Grip">
      <ScrollView
        style={{ paddingBottom: 24 }}>
        <BrakeThrottleChart
          brake={brakeThrottle.brake}
          throttle={brakeThrottle.throttle} />
        <SteeringChart
          steeringAngle={steering} />
        <SlipAngle key={'slipAngle'} />
      </ScrollView>
    </AppBarContainer>
  )
}