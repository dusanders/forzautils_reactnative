import React, { memo, useEffect, useState } from "react";
import { LayoutRectangle, StyleSheet, View } from "react-native";
import { ThemeText } from "../../components/ThemeText";
import { invokeWithTheme } from "../../hooks/ThemeState";

export interface SteeringChartProps {
  steeringAngle: number;
}

const defaultLayout: LayoutRectangle = {
  width: 0,
  height: 0,
  x: 0,
  y: 0
}

export const SteeringChart = memo((props: SteeringChartProps) => {
  const [steeringViewLayout, setSteeringViewLayout] = useState<LayoutRectangle>(defaultLayout);
  const [indicatorPosition, setIndicatorPosition] = useState(50);
  const style = themeStyles(indicatorPosition);
  useEffect(() => {
    if (props.steeringAngle === 0 || steeringViewLayout.width === 0) {
      setIndicatorPosition(steeringViewLayout.width / 2);
      return;
    }
    const halfWidth = steeringViewLayout.width / 2;
    if (props.steeringAngle < 0) {
      const angleNormalized = ((props.steeringAngle - (-127)) / (0 - (-127)));
      const leftPercent = angleNormalized * halfWidth;
      setIndicatorPosition(leftPercent);
    } else {
      const angleNormalized = ((props.steeringAngle - 0) / 127 - 0);
      const rightPercent = angleNormalized * halfWidth;
      setIndicatorPosition(halfWidth + rightPercent);
    }
  }, [steeringViewLayout, props.steeringAngle]);

  return (
    <View style={style.root}>
      <ThemeText
        fontSize="large"
        fontFamily="bold"
        style={style.labelText}>
        Steering Input
      </ThemeText>
      <View style={style.spacerView}
        onLayout={(ev) => {
          setSteeringViewLayout(ev.nativeEvent.layout);
        }}>
        <View style={[style.indicatorView]} />
      </View>
    </View>
  )
});
function themeStyles(indicatorPosition: number) {
  return invokeWithTheme((theme) => StyleSheet.create({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center'
    },
    labelText: {
      textAlign: 'center',
      marginBottom: 12
    },
    indicatorView: {
      height: '100%',
      width: 4,
      backgroundColor: theme.colors.text.primary.onPrimary,
      position: 'absolute',
      left: indicatorPosition
    },
    spacerView: {
      backgroundColor: theme.colors.background.onPrimary,
      height: 40,
      width: '90%',
      margin: 'auto'
    }
  }));
}