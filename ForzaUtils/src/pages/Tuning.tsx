import React, { useState } from "react";
import { AppBarContainer } from "../components/AppBarContainer";
import { StyleSheet, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IThemeElements } from "../constants/Themes";
import { useTheme } from "../context/Theme";
import { CardInput } from "../components/CardInput";
import { Row } from "../components/Row";
import { CardContainer } from "../components/CardContainer";
import { ThemeSwitch } from "../components/ThemeSwitch";
import { LabelText } from "../components/ThemeText";

export interface TuningPageProps {
  // No props needed for this page
}

export function TuningPage(props: TuningPageProps) {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
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