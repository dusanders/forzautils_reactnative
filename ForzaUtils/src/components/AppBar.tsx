import React, { useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { IThemeElements } from "../constants/Themes";
import { ThemeText } from "./ThemeText";
import { ThemeIcon } from "./ThemeIcon";
import { Container } from "./Container";
import { ThemeSwitch } from "./ThemeSwitch";

export interface AppBarProps {
  title?: string;
  hideSettings?: boolean;
  hideBack?: boolean;
  onBack?: () => void;
}

export function AppBar(props: AppBarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const theme = useTheme();
  const style = themeStyles(theme.theme);
  let doShowSettingsButton = true;
  if (props.hideSettings != undefined) {
    doShowSettingsButton = !props.hideSettings
  }
  let doShowBackButton = true;
  if (props.hideBack != undefined) {
    doShowBackButton = !props.hideBack
  }
  return (
    <>
      {showSettings && (
        <TouchableOpacity
          style={style.settingsFlyoutOutsideTouchable}
          onPress={() => {
            setShowSettings(false)
          }} />
      )}
      <View style={style.root}>
        <ThemeText style={style.titleText}
          fontFamily={'bold'}>
          {props.title}
        </ThemeText>

        {doShowBackButton && (
          <Pressable style={style.backIconView}
            onPress={() => {
              if (props.onBack) {
                console.log(`back press`)
                props.onBack()
              } else {
                console.log(`no back prop`)
              }
            }}>
            <ThemeIcon name={'chevron-left'}
              size={theme.theme.sizes.icon} />
          </Pressable>
        )}

        <View style={{ flexGrow: 1 }} />

        {doShowSettingsButton && (
          <Pressable style={style.settingIconView}
            onPress={() => {
              setShowSettings(!showSettings)
            }}>
            <ThemeIcon name={'settings'}
              size={theme.theme.sizes.icon} />
          </Pressable>
        )}

        {showSettings && (
          <Container
            variant={'secondary'}
            style={style.settingsFlyoutView}>
            <View style={style.settingsFlyoutContent}>
              <ThemeText
                variant={'primary'}
                onBackground={'onSecondary'}>
                Dark Mode
              </ThemeText>
              <ThemeSwitch
                onPalette={'secondary'}
                onValueChange={(val) => {
                  theme.changeTheme(val ? 'dark' : 'light')
                }}
                value={theme.current === 'dark'} />
            </View>
          </Container>
        )}
      </View>
    </>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: theme.sizes.navBar + theme.sizes.borderRadius,
      backgroundColor: theme.colors.background.primary,
      display: 'flex',
      flexDirection: 'row',
      padding: theme.sizes.borderRadius,
      justifyContent: 'space-between',
      overflow: 'visible'
    },
    settingsFlyoutView: {
      width: '45%',
      bottom: -(theme.sizes.icon + 8 + 12),
      right: theme.sizes.borderRadius,
      position: 'absolute',
      backgroundColor: theme.colors.background.secondary,
      elevation: 10,
      zIndex: 10,
    },
    settingsFlyoutContent: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    settingsFlyoutOutsideTouchable: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      zIndex: 2
    },
    settingIconView: {
      padding: 5,
      backgroundColor: theme.colors.background.onPrimary,
      borderRadius: 100,
      alignSelf: 'center',
    },
    backIconView: {
      padding: 5,
      backgroundColor: theme.colors.background.onPrimary,
      borderRadius: 100,
      alignSelf: 'center',
    },
    titleText: {
      textAlign: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      width: '100%',
      position: 'absolute',
      textTransform: 'uppercase',
    }
  })
}