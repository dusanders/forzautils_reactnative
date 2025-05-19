import React from "react";
import { StyleSheet, View } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import { ThemeText } from "../../components/ThemeText";
import { CardContainer } from "../../components/CardContainer";
import { useCurrentTheme } from "../../hooks/ThemeState";

export interface TireInfoProps {
  temp: number;
  title: string;
}

export function TireInfo(props: TireInfoProps) {
  const theme = useCurrentTheme();
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
        height: '75%',
        maxHeight: 200,
        width: "50%",
        minWidth: 20,
        maxWidth: 175,
        backgroundColor: colorForTemp(props.temp),
        marginBottom: 12,
        marginTop: 12,
        borderRadius: theme.sizes.borderRadius
      }} />
    )
  }
  const DataCard = (props: { children: any }) => (
    <CardContainer 
    centerContent
    style={{
      ...style.halfWidth,
      ...style.centerContent
    }}>
      {props.children}
    </CardContainer>
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