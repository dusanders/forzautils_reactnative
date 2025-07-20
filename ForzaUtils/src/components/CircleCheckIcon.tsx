import { StyleSheet, View } from "react-native";
import { ThemeIcon } from "./ThemeIcon";
import { invokeWithTheme } from "../hooks/ThemeState";


export interface CircleCheckIconProps {
  // none
}

export function CircleCheckIcon(props: CircleCheckIconProps) {
  const style = themeStyles();
  return (
    <View style={style.root}>
      <View style={style.circle}></View>
      <ThemeIcon name={'check'} />
    </View>
  )
}
function themeStyles() {
  return invokeWithTheme((theme) => StyleSheet.create({
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
  }));
}