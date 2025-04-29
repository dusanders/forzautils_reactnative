import React, { memo, useEffect, useState } from "react";
import { LayoutRectangle, StyleSheet, View } from "react-native";
import { ThemeText } from "../../components/ThemeText";
import { IThemeElements } from "../../constants/Themes";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/ThemeStore";

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
  const theme = useSelector(getTheme);
  const style = themeStyles(theme);
  const [steeringViewLayout, setSteeringViewLayout] = useState<LayoutRectangle>(defaultLayout);
  const [indicatorPosition, setIndicatorPosition] = useState(50);
  useEffect(() => {
    console.log(`layout: ${JSON.stringify(steeringViewLayout)}`);
    console.log(`angle: ${props.steeringAngle}`);
    if(props.steeringAngle === 0 || steeringViewLayout.width === 0) {
      setIndicatorPosition(steeringViewLayout.width / 2);
      return;
    }
    const halfWidth = steeringViewLayout.width / 2;
    if(props.steeringAngle < 0) {
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
      <View style={{
        backgroundColor: theme.colors.background.onPrimary,
        height: 40,
        width: '90%',
        margin: 'auto'
      }}
      onLayout={(ev) => {
        setSteeringViewLayout(ev.nativeEvent.layout);
      }}>
        <View style={[
          {
            height: '100%',
            width: 4,
            backgroundColor: theme.colors.text.primary.onPrimary,
            position: 'absolute',
            left: indicatorPosition
          }
        ]}/>
      </View>
    </View>
  )
});
function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
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
    }
  })
}