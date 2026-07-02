import { StyleSheet, View } from "react-native";
import { ThemeIcon, ThemeIconNames } from "./ThemeIcon";
import { IThemeElements } from "@/theme/Themes";
import { useThemeContext } from "@/theme/ThemeProvider";


export interface CircleCheckIconProps {
  // none
}

export function CircleCheckIcon(props: CircleCheckIconProps) {
  const theme = useThemeContext();
  const style = themeStyles(theme.theme);
  return (
    <View style={style.root}>
      <View style={style.circle}></View>
      <ThemeIcon name={ThemeIconNames.CHECK} />
    </View>
  )
}
function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      height: 50,
      width: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      borderColor: theme.colors.text.primary.onPrimary,
      borderRadius: 100,
      borderWidth: 0.8,
      position: 'absolute',
      height: '100%',
      width: '100%',
      opacity: 0.25
    }
  });
}