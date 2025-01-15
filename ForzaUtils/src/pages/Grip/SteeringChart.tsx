import React, { memo } from "react";
import { BarChart } from "react-native-chart-kit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";
import { useTheme } from "../../hooks/useTheme";
import { StyleSheet, View } from "react-native";
import { ThemeText } from "../../components/ThemeText";
import { IThemeElements } from "../../constants/Themes";

export interface SteeringChartProps {
  steeringAngle: number;
}

export const SteeringChart = memo((props: SteeringChartProps) => {
  const theme = useTheme().theme;
  const style = themeStyles(theme);
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
      }}>
        <View style={[
          {
            height: '100%',
            width: 4,
            backgroundColor: theme.colors.text.primary.onPrimary,
            position: 'absolute',
            left: '50%'
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