import React, { useCallback, useEffect, useState } from "react";
import { AppBarContainer } from "../../components/AppBarContainer";
import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from "../../hooks/useNavigation";
import { IThemeElements } from "../../constants/Themes";
import { StyleSheet, View } from "react-native";
import { INavigationTarget } from "../../context/Navigator";
import { ITireTempViewModel } from "../../context/viewModels/TireTempViewModel";
import { Card } from "../../components/Card";
import { Row } from "../../components/Row";
import { TireInfo } from "./TireInfo";

export interface TireTempsProps extends INavigationTarget {
  viewModel: ITireTempViewModel;
}

export function TireTemps(props: TireTempsProps) {
  const theme = useTheme().theme;
  const style = themeStyles(theme);
  const navigation = useNavigation();
  const [temps, setTemps] = useState<number[]>([0,0,0,0]);
  const handleUpdate = useCallback(() => {
    setTemps([
      props.viewModel.leftFront,
      props.viewModel.rightFront,
      props.viewModel.leftRear,
      props.viewModel.rightRear
    ])
  }, []);
  useEffect(() => {
    setTemps([
      props.viewModel.leftFront,
      props.viewModel.rightFront,
      props.viewModel.leftRear,
      props.viewModel.rightRear
    ])
  }, 
    [props.viewModel.leftFront]);

  return (
    <AppBarContainer
      title="Tire Temps"
      onBack={() => {
        navigation.goBack()
      }}>
      <Row style={style.halfHeight}>
        <TireInfo temp={temps[0]}
          title="Left Front" />
        <TireInfo temp={temps[1]}
          title="Right Front" />
      </Row>
      <Row style={style.halfHeight}>
        <TireInfo temp={temps[2]}
          title="Left Rear" />
        <TireInfo temp={temps[3]}
          title="Right Rear" />
      </Row>
    </AppBarContainer>
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