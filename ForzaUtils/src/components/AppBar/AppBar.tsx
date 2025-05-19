import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import { ThemeText } from "../ThemeText";
import { ThemeIcon } from "../ThemeIcon";
import { Container } from "../Container";
import { ThemeSwitch } from "../ThemeSwitch";
import { AppBarSettingsButtonParams, AppSettingsButton } from "./AppSettingsButton";
import { setThemeAtom, themeAtom, themeTypeAtom } from "../../hooks/ThemeState";
import { useAtomValue, useSetAtom } from "jotai";

export const AppBarTestID = {
  root: 'app-bar-root',
  titleText: 'app-bar-title-text',
  backIconView: 'app-bar-back-icon-view',
  settingIconView: 'app-bar-setting-icon-view',
  settingsFlyoutView: 'app-bar-settings-flyout-view',
  settingsFlyoutContent: 'app-bar-settings-flyout-content',
  settingsFlyoutOutsideTouchable: 'app-bar-settings-flyout-outside-touchable',
};

export interface AppBarProps {
  title?: string;
  hideSettings?: boolean;
  hideBack?: boolean;
  injectElements?: AppBarSettingsButtonParams[];
  onBack?: () => void;
}

export function AppBar(props: AppBarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const theme = useAtomValue(themeAtom);
  const themeType = useAtomValue(themeTypeAtom);
  const test = useSetAtom(setThemeAtom);
  const style = themeStyles(theme);
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
          testID={AppBarTestID.settingsFlyoutOutsideTouchable}
          style={style.settingsFlyoutOutsideTouchable}
          onPress={() => {
            setShowSettings(false)
          }} />
      )}
      <View testID={AppBarTestID.root} style={style.root}>
        {props.title && (
          <ThemeText testID={AppBarTestID.titleText}
            style={style.titleText}
            fontFamily={'bold'}>
            {props.title}
          </ThemeText>
        )}

        {doShowBackButton && (
          <TouchableOpacity testID={AppBarTestID.backIconView}
            style={style.backIconView}
            onPress={() => {
              if (props.onBack) {
                props.onBack()
              }
            }}>
            <ThemeIcon name={'chevron-left'}
              size={theme.sizes.icon} />
          </TouchableOpacity>
        )}

        <View style={{ flexGrow: 1 }} />

        {doShowSettingsButton && (
          <TouchableOpacity testID={AppBarTestID.settingIconView}
            style={style.settingIconView}
            onPress={() => {
              setShowSettings(!showSettings)
            }}>
            <ThemeIcon name={'settings'}
              size={theme.sizes.icon} />
          </TouchableOpacity>
        )}

        {showSettings && (
          <Container
            testID={AppBarTestID.settingsFlyoutView}
            variant={'secondary'}
            style={style.settingsFlyoutView}>
            <View
              testID={AppBarTestID.settingsFlyoutContent}
              style={style.settingsFlyoutContent}>
              <View style={style.themeButtonView}>
                <ThemeText
                  variant={'primary'}
                  onBackground={'onSecondary'}>
                  Dark Mode
                </ThemeText>
                <ThemeSwitch
                  onPalette={'secondary'}
                  onValueChange={(val) => {
                    test(val ? 'dark' : 'light');
                  }}
                  value={themeType === 'dark'} />
              </View>
              {props.injectElements && (
                <View style={{
                  width: '100%'
                }}>
                  {props.injectElements.map((injected) => (
                    <AppSettingsButton
                      key={injected.id}
                      onPress={() => {
                        injected.onPress()
                      }}>
                      {injected.renderItem()}
                    </AppSettingsButton>
                  ))}
                </View>
              )}
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
    },
    themeButtonView: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    settingsFlyoutView: {
      width: '50%',
      top: (theme.sizes.navBar),
      right: theme.sizes.borderRadius,
      position: 'absolute',
      backgroundColor: theme.colors.background.secondary,
      elevation: 10,
      zIndex: 10,
    },
    settingsFlyoutContent: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    settingsFlyoutOutsideTouchable: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      zIndex: 2,
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
      zIndex: 10,
      elevation: 10
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