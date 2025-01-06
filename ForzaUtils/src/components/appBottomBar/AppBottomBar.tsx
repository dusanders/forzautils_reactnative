import React from "react";
import { Button, Pressable, Text, View } from "react-native";
import { ThemeType, withTheme } from "../../hooks/withTheme";

export interface AppBottomBarProps {
  theme: ThemeType;
  onIpInfoClick(): void;
  onDataClick(): void;
}

interface NavButtonProps {
  text?: string;
  icon?: JSX.Element;
  theme: ThemeType;
  onClick(): void;
}
function NavButton(props: NavButtonProps) {
  const colors = withTheme(props.theme);

  return (
    <Pressable style={{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.navBtnBackground,
    }}
      onPress={() => {
        props.onClick()
      }}>
      <>
        {props.icon}
        <Text style={{
          color: colors.text.primary
        }}>
          {props.text}
        </Text>
      </>
    </Pressable>
  )
}
export function AppBottomBar(props: AppBottomBarProps) {
  const colors = withTheme(props.theme);
  return (
    <View style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    }}>
      <NavButton
        text="IP Info"
        theme={props.theme}
        onClick={() => { props.onIpInfoClick() }} />
      <NavButton
        text="DATA"
        theme={props.theme}
        onClick={() => { props.onDataClick() }} />
    </View>
  )
}