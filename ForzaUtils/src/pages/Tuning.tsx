import React, { useState } from "react";
import { AppBarContainer } from "../components/AppBar/AppBarContainer";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IThemeElements } from "../constants/Themes";
import { CardInput } from "../components/CardInput";
import { Row } from "../components/Row";
import { CardContainer } from "../components/CardContainer";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { LabelText } from "../components/ThemeText";
import { useSelector } from "react-redux";
import { getTheme } from "../redux/ThemeStore";

export interface TuningPageProps {
  // No props needed for this page
}

export function TuningPage(props: TuningPageProps) {
  const navigation = useNavigation();
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const [totalWeight, setTotalWeight] = useState<string>("");
  const [rollCage, setRollCage] = useState(false);

  return (
    <AppBarContainer onBack={() => {
      navigation.goBack();
    }}>
      <Row style={styles.baseRow}>
        <CardInput
          label="Vehicle Weight"
          value={totalWeight} // This will be bound to state in a real application
          onChange={(value: string) => {
            setTotalWeight(value);
          }}
          placeholder="Vehicle Weight" />
        <CardContainer
          centerContent>
          <ThemeSwitch
            value={rollCage}
            onValueChange={(ev) => setRollCage(ev)} />
          <LabelText>
            Roll Cage
          </LabelText>
        </CardContainer>
      </Row>
    </AppBarContainer>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    baseRow: {

    }
  })
}