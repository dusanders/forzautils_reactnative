import React from "react";
import { StyleSheet, View } from "react-native";
import { Card } from "../../components/Card";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { ThemeText } from "../../components/ThemeText";

export interface TireInfoProps {
  temp: number;
  title: string;
}

export function TireInfo(props: TireInfoProps) {
  const theme = useTheme().theme;
  const style = themeStyles(theme);

  const colorForTemp = (temp: number) => {
    if(temp < 210) {
      return theme.colors.text.primary.onPrimary
    }
    if(temp < 240) {
      return theme.colors.text.warning.onPrimary
    }
    return theme.colors.text.error.onPrimary
  }

  const TempView = () => {
    return (
      <View style={{
        height: '50%',
        width: '40%',
        backgroundColor: colorForTemp(props.temp),
        marginBottom: 12,
        marginTop: 12,
        borderRadius: theme.sizes.borderRadius
      }} />
    )
  }
  const DataCard = (props: { children: any }) => (
    <Card style={[
      style.halfWidth,
      style.centerContent
    ]}>
      {props.children}
    </Card>
  )
  return (
    <DataCard>
      <ThemeText>
        {props.temp}
      </ThemeText>
      <TempView />
      <ThemeText>
        {props.title}
      </ThemeText>
    </DataCard>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    halfWidth: {
      width: '50%'
    },
    halfHeight: {
      height: '50%'
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
}