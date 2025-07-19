import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { AppRoutes, RootStackParamList } from "../../constants/types";
import { View } from "react-native";
import { ThemeButton } from "../../components/ThemeButton";
import { ThemeText } from "../../components/ThemeText";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { Dropdown } from "../../components/Dropdown";
import { themeService } from "../../hooks/ThemeState";
import { ThemeType } from "../../constants/Themes";

export interface SettingsProps {
  // Nothing specific for now
}
type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, AppRoutes.SETTINGS>;
export function Settings(props: SettingsScreenProps) {
  const { navigation } = props;
  const themeVm = themeService();
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
      {/* Settings UI goes here */}
      <ThemeButton onPress={() => navigation.goBack()}>
        <ThemeText>Back</ThemeText>
      </ThemeButton>
      <ThemeButton onPress={() => console.log("Settings saved")}>
        <ThemeText>Save</ThemeText>
      </ThemeButton>
      <ThemeButton onPress={() => console.log("Settings reset")}>
        <ThemeText>Reset</ThemeText>
      </ThemeButton>
    </AppBarContainer>
  );
}