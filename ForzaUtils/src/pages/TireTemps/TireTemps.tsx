import React, { useMemo } from "react";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { IThemeElements } from "../../constants/Themes";
import { StyleSheet } from "react-native";
import { Row } from "../../components/Row";
import { TireInfo } from "./TireInfo";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";
import { useCurrentTheme } from "../../hooks/ThemeState";
import { useTireTempsViewModel } from "../../context/viewModels/TireTempViewModel";

export interface TireTempsProps {
  // Nothing
}

export function TireTemps(props: TireTempsProps) {
  const theme = useCurrentTheme();
  const style = themeStyles(theme);
  const navigation = useNavigation<StackNavigation>();
  const tireTempVM = useTireTempsViewModel();
  
  const temps = useMemo(() => {
    return [
      tireTempVM.leftFront,
      tireTempVM.rightFront,
      tireTempVM.leftRear,
      tireTempVM.rightRear
    ]
  }, [tireTempVM.leftFront, tireTempVM.rightFront,
    tireTempVM.leftRear, tireTempVM.rightRear
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