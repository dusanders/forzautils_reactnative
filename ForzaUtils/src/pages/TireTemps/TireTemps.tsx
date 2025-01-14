import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AppBarContainer } from "../../components/AppBarContainer";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { StyleSheet } from "react-native";
import { Row } from "../../components/Row";
import { TireInfo } from "./TireInfo";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";

export interface TireTempsProps {
  // Nothing
}

export function TireTemps(props: TireTempsProps) {
  const theme = useTheme().theme;
  const style = themeStyles(theme);
  const navigation = useNavigation<StackNavigation>();
  const store = useViewModelStore();
  const viewModel = store.tireTemps;
  
  const temps = useMemo(() => {
    return [
      viewModel.leftFront,
      viewModel.rightFront,
      viewModel.leftRear,
      viewModel.rightRear
    ]
  }, [viewModel.leftFront, viewModel.rightFront,
    viewModel.leftRear, viewModel.rightRear
  ]);

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