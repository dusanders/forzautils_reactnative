import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { AppRoutes, RootStackParamList } from "../../constants/types";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { Dropdown } from "../../components/Dropdown";
import { themeService } from "../../hooks/ThemeState";
import { ThemeType } from "../../constants/Themes";
import { useTuningViewModel } from "../../context/viewModels/Tuning/TuningViewModel";
import { CalculatorTypes } from "../../context/viewModels/Tuning/Calculators";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";

export interface SettingsProps {
  // Nothing specific for now
}
type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, AppRoutes.SETTINGS>;
export function Settings(props: SettingsScreenProps) {
  const { navigation } = props;
  const themeVm = themeService();
  const tuningVm = useViewModelStore().tuning;
  return (
    <AppBarContainer hideSettings
      title="Settings">
      <Dropdown
        label="Theme"
        value={themeVm.themeType}
        options={[
          { label: ThemeType.LIGHT, value: ThemeType.LIGHT },
          { label: ThemeType.DARK, value: ThemeType.DARK },
          { label: ThemeType.FOREST, value: ThemeType.FOREST },
          { label: ThemeType.CLAUDES, value: ThemeType.CLAUDES },
        ]}
        onValueChanged={(option) => {
          themeVm.updateTheme(option.value);
        }} />
      <Dropdown
        label="Calculator Type"
        value={tuningVm.calculatorType}
        options={[
          { label: CalculatorTypes.GROK, value: CalculatorTypes.GROK },
          { label: CalculatorTypes.SONNET, value: CalculatorTypes.SONNET },
        ]}
        onValueChanged={(option) => {
          tuningVm.setCalculatorType(option.value);
        }} />
    </AppBarContainer>
  );
}