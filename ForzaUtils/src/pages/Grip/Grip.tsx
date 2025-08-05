import React, { useMemo } from "react";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { BrakeThrottleChart, BrakeThrottleChartProps } from "./BrakeThrottleChart";
import { SteeringChart } from "./SteeringChart";
import { TireSlip } from "./TireSlip";
import { ScrollView } from "react-native";
import { TireData } from "ForzaTelemetryApi";
import { SlipAngle } from "../../components/Graphs/SlipAngle";

export interface GripProps {
  // Nothing
}

export function Grip(props: GripProps) {
  const navigation = useNavigation<StackNavigation>();
  const viewModel = useViewModelStore().grip;
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