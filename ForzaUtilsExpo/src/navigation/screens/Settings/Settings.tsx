import { AppBarContainer } from "@/components/AppBar/AppBarContainer";
import { Dropdown } from "@/components/Dropdown";
import { RootStackParamList, AppRoutes } from "@/navigation/types";
import { useThemeContext } from "@/theme/ThemeProvider";
import { ThemeType } from "@/theme/Themes";
import { CalculatorTypes } from "@/viewModels/Tuning/Calculators";
import { useTuningViewModel } from "@/viewModels/Tuning/TuningViewModel";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";

export interface SettingsProps {
  // Nothing specific for now
}
type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, AppRoutes.SETTINGS>;
export function Settings(props: SettingsScreenProps) {
  const { navigation } = props;
  const themeVm = useThemeContext();
  const tuningVm = useTuningViewModel();
  return (
    <AppBarContainer hideSettings
      title="Settings">
      <Dropdown
        label="Theme"
        value={themeVm.currentTheme}
        options={[
          { label: ThemeType.LIGHT, value: ThemeType.LIGHT },
          { label: ThemeType.DARK, value: ThemeType.DARK },
          { label: ThemeType.FOREST, value: ThemeType.FOREST },
          { label: ThemeType.CLAUDES, value: ThemeType.CLAUDES },
        ]}
        onValueChanged={(option) => {
          themeVm.setTheme(option.value);
        }} />
      <Dropdown
        label="Calculator Type"
        value={tuningVm.calculatorType}
        options={[
          { label: CalculatorTypes.GROK, value: CalculatorTypes.GROK },
          { label: CalculatorTypes.GROK2, value: CalculatorTypes.GROK2 },
          { label: CalculatorTypes.SONNET, value: CalculatorTypes.SONNET },
        ]}
        onValueChanged={(option) => {
          tuningVm.setCalculatorType(option.value);
        }} />
    </AppBarContainer>
  );
}