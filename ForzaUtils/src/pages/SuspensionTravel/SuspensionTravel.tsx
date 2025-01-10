import React from "react";
import { StyleSheet, View } from "react-native";
import { ISuspensionGraphViewModel } from "../../context/viewModels/SuspensionGraphViewModel";
import { INavigationTarget } from "../../context/Navigator";
import { AppBarContainer } from "../../components/AppBarContainer";
import { useNavigation } from "../../hooks/useNavigation";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";

export interface SuspensionTravelProps extends INavigationTarget {
  viewModel: ISuspensionGraphViewModel;
}

export function SuspensionTravel(props: SuspensionTravelProps) {
  const navigation = useNavigation();
  const theme = useTheme().theme;
  const style = themeStyles(theme);

  return (
    <AppBarContainer
      title="Suspension Travel"
      onBack={() => { navigation.goBack() }}>
      <View style={style.content}>

      </View>
    </AppBarContainer>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    content: {
      height: '100%'
    }
  })
}