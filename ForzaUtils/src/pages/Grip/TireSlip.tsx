import React from "react";
import { StyleSheet, View } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import { useTheme } from "../../context/Theme";
import { ThemeText } from "../../components/ThemeText";
import { Row } from "../../components/Row";
import { TextCard } from "../../components/TextCard";

export interface TireSlipProps {
  leftFront: number;
  rightFront: number;
  leftRear: number;
  rightRear: number;
}

export function TireSlip(props: TireSlipProps) {
  const theme = useTheme().theme;
  const style = themeStyles(theme);

  return (
    <View style={style.root}>
      <ThemeText
        fontSize="large"
        fontFamily="bold"
        style={style.titleText}>
        Slip Angles
      </ThemeText>
      <Row>
        <TextCard style={style.cardBase}>
          <ThemeText>
            Left Front
          </ThemeText>
          <ThemeText
            fontSize="large"
            fontFamily="bold"
            style={style.angleText}>
            {props.leftFront}
          </ThemeText>
        </TextCard>
        <TextCard style={style.cardBase}>
          <ThemeText>
            Right Front
          </ThemeText>
          <ThemeText
            fontSize="large"
            fontFamily="bold"
            style={style.angleText}>
            {props.rightFront}
          </ThemeText>
        </TextCard>
      </Row>
      <Row>
        <TextCard style={style.cardBase}>
          <ThemeText>
            Left Rear
          </ThemeText>
          <ThemeText
            fontSize="large"
            fontFamily="bold"
            style={style.angleText}>
            {props.leftRear}
          </ThemeText>
        </TextCard>
        <TextCard style={style.cardBase}>
          <ThemeText>
            Right Rear
          </ThemeText>
          <ThemeText
            fontSize="large"
            fontFamily="bold"
            style={style.angleText}>
            {props.rightRear}
          </ThemeText>
        </TextCard>
      </Row>
    </View>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      marginTop: 18,
    },
    titleText: {
      textAlign: 'center',
      marginBottom: 18
    },
    cardBase: {
      width: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    angleText: {
      marginTop: 12
    }
  })
}