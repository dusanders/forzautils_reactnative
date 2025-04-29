import { View } from "react-native";
import { useSelector } from "react-redux";
import { getTheme } from "../redux/ThemeStore";
import { ThemeIcon } from "./ThemeIcon";


export interface CircleCheckIconProps {
  // none
}

export function CircleCheckIcon(props: CircleCheckIconProps) {
  const theme = useSelector(getTheme);
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