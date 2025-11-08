import React, { memo } from "react";
import { ColorValue, StyleSheet, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { ThemeText } from "../../components/ThemeText";
import { Row } from "../../components/Row";
import { GlobalStyles } from "../../types/Themes";

export interface BrakeThrottleChartProps {
  throttle: number;
  brake: number;
}

interface LabeledDotProps {
  color: ColorValue;
  label: string;
}
function LabeledDot(props: LabeledDotProps) {
  const styles = StyleSheet.create({
    dotBg: {
      marginRight: 10,
      height: 20,
      width: 20,
      borderRadius: 20,
      backgroundColor: props.color
    },
    rowRoot: {
      width: '50%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
  return (
    <Row style={styles.rowRoot}>
      <View style={styles.dotBg} />
      <ThemeText>
        {props.label}
      </ThemeText>
    </Row>
  )
}
export const BrakeThrottleChart = memo((props: BrakeThrottleChartProps) => {
  const styles = themeStyles();
  return (
    <View style={[GlobalStyles.centerContent]}>
      <Row style={styles.brakeThrottleRow}>
        <LabeledDot color={'green'} label={'Throttle'} />
        <LabeledDot color={'red'} label={'Brake'} />
      </Row>
      <ProgressChart
        style={{
          backgroundColor: '#00000000'
        }}
        data={{
          labels: ['Brake', 'Throttle'],
          data: [props.brake / 100, props.throttle / 100]
        }}
        width={300}
        height={300}
        strokeWidth={18}
        radius={50}
        hideLegend
        chartConfig={{
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          color: (op, index) => {
            switch (index) {
              case 0: return `rgba(244,0,0,${op})`
            }
            return `rgba(0,255,0,${op})`;
          }
        }} />
    </View>
  )
});

function themeStyles() {
  return StyleSheet.create({
    brakeThrottleRow: {
      width: '100%',
      justifyContent: 'space-evenly'
    }
  })
}