import React from "react";
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { LabelText } from "./ThemeText";
import { useCurrentTheme } from "../hooks/ThemeState";

export interface CardInputProps {
  value: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}
export function CardInput(props: CardInputProps) {
  const theme = useCurrentTheme();
  const styles = themeStyles(theme);

  return (
    <View style={[styles.root, props.style]}>
      <TextInput
        value={props.value}
        onChangeText={(text) => props.onChange(text)}
        placeholder={props.placeholder || ""}
        placeholderTextColor={theme.colors.text.secondary.onSecondary}
        style={styles.input}
        keyboardType={'numeric'}
        autoCapitalize="none"
        autoCorrect={false} />
      <LabelText 
      style={styles.label}>
        {props.label}
      </LabelText>
    </View>
  )
}
function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      padding: theme.sizes.paper.padding,
      marginTop: theme.sizes.paper.spacingY / 2,
      marginBottom: theme.sizes.paper.spacingY / 2,
      marginLeft: theme.sizes.paper.spacingX / 2,
      marginRight: theme.sizes.paper.spacingX / 2,
      borderColor: theme.colors.background.onPrimary,
      borderWidth: 0.8,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      flexGrow: 1
    },
    input: {
      backgroundColor: theme.colors.background.onPrimary,
      width: '100%',
      color: theme.colors.text.primary.onPrimary,
      padding: 8
    },
    label: {
      textAlign: 'center',
    }
  })
}