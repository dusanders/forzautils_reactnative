import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { IThemeElements } from "../constants/Themes";
import { ThemeText } from "./ThemeText";
import Icon from '@react-native-vector-icons/feather';
import { ThemeIcon } from "./ThemeIcon";
import { Container } from "./Container";
import { ThemeSwitch } from "./ThemeSwitch";

export interface AppBarProps {
  title?: string;
  withSettings?: boolean;
  onBack?: () => void;
}

export function AppBar(props: AppBarProps) {
  const [showSettings, setShowSettings] = useState(true);
  const theme = useTheme();
  const style = themeStyles(theme.theme);

  return (
    <View style={style.root}>
      <ThemeText style={style.titleText}
        fontFamily={'bold'}>
        {props.title}
      </ThemeText>
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
      <Pressable style={style.settingIconView}
        onPress={() => {
          setShowSettings(!showSettings)
        }}>
        <ThemeIcon name={'settings'}
          size={theme.theme.sizes.icon} />
      </Pressable>
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
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      position: 'absolute',
      top: 0,
      width: '100%',
      backgroundColor: theme.colors.background.primary,
      display: 'flex',
      flexDirection: 'row',
      padding: 8,
      justifyContent: 'space-between',
      overflow: 'visible'
    },
    settingsFlyoutView: {
      width: '40%',
      bottom: -(theme.sizes.icon + 8 + 12),
      right: 5,
      position: 'absolute',
      backgroundColor: theme.colors.background.secondary,
      elevation: 10,
      zIndex: 10,
    },
    settingsFlyoutContent: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
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