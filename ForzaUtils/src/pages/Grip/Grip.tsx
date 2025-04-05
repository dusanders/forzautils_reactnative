import React, { useMemo } from "react";
import { AppBarContainer } from "../../components/AppBarContainer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { useTheme } from "../../context/Theme";
import { BrakeThrottleChart, BrakeThrottleChartProps } from "./BrakeThrottleChart";
import { SteeringChart } from "./SteeringChart";
import { TireSlip } from "./TireSlip";
import { ScrollView } from "react-native";
import { TireData } from "ForzaTelemetryApi";

export interface GripProps {
  // Nothing
}

export function Grip(props: GripProps) {
  const theme = useTheme().theme;
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
      onBack={() => { navigation.pop() }}
      title="Grip">
      <ScrollView
        style={{ paddingBottom: 24 }}>
        <BrakeThrottleChart
          brake={brakeThrottle.brake}
          throttle={brakeThrottle.throttle} />
        <SteeringChart
          steeringAngle={steering} />
        <TireSlip
          leftFront={tireSlipData.leftFront}
          rightFront={tireSlipData.rightFront}
          leftRear={tireSlipData.leftRear}
          rightRear={tireSlipData.rightRear} />
      </ScrollView>
    </AppBarContainer>
  )
}