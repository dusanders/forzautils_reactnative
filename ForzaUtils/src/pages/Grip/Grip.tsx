import React, { useMemo } from "react";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";
import { BrakeThrottleChart, BrakeThrottleChartProps } from "./BrakeThrottleChart";
import { SteeringChart } from "./SteeringChart";
import { TireSlip } from "./TireSlip";
import { ScrollView } from "react-native";
import { TireData } from "ForzaTelemetryApi";
import { useGripViewModel } from "../../context/viewModels/GripViewModel";

export interface GripProps {
  // Nothing
}

export function Grip(props: GripProps) {
  const navigation = useNavigation<StackNavigation>();
  const gripVM = useGripViewModel();
  const brakeThrottle = useMemo<BrakeThrottleChartProps>(() => {
    return {
      brake: gripVM.brake,
      throttle: gripVM.throttle
    }
  }, [gripVM.brake, gripVM.throttle]);

  const steering = useMemo<number>(() => {
    return gripVM.steering;
  }, [gripVM.steering]);

  const tireSlipData = useMemo<TireData>(() => {
    return gripVM.slipRatio
  }, [gripVM.slipRatio])

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