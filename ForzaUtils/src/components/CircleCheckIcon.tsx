import { View } from "react-native";
import { ThemeIcon } from "./ThemeIcon";
import { themeService } from "../hooks/ThemeState";


export interface CircleCheckIconProps {
  // none
}

export function CircleCheckIcon(props: CircleCheckIconProps) {
  const theme = themeService().theme;
  return (
    <View style={{
      height: 50,
      width: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        borderColor: theme.colors.text.primary.onPrimary,
        borderRadius: 100,
        borderWidth: 0.8,
        position: 'absolute',
        height: '100%',
        width: '100%',
        opacity: 0.25
      }}></View>
      <ThemeIcon name={'check'} />
    </View>
  )
}