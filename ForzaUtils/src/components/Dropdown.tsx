import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { Picker } from "@react-native-picker/picker";
import { themeService } from "../hooks/ThemeState";
import { ThemeText, TitleText } from "./ThemeText";

export interface IDropdownOption {
  label: string;
  value: any;
}

export interface DropdownProps {
  label?: string;
  value: IDropdownOption['value'];
  options: IDropdownOption[];
  onValueChanged(option: IDropdownOption): void;
}

export function Dropdown(props: DropdownProps) {
  const theme = themeService().theme;
  const styles = themeStyles(theme);
  const [value, setValue] = useState(props.value);

  return (
    <View style={{ padding: 8 }}>
      {props.label && (
        <View style={styles.titleView}>
          <TitleText>
            {props.label}
          </TitleText>
        </View>
      )}
      <Picker
        itemStyle={styles.itemBase}
        selectedValue={value}
        onValueChange={(ev) => {
          const selectedOption = props.options.find(i => i.value === ev);
          if (selectedOption) {
            setValue(selectedOption.value);
            props.onValueChanged(selectedOption)
          }
        }}>
        {props.options.map((value, index) => (
          <Picker.Item
            style={styles.labelStyle}
            key={index}
            label={value.label}
            value={value.value}
          />
        ))}
      </Picker>
    </View>
  )
}
function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    titleView: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleText: {
      color: theme.colors.text.primary.onPrimary
    },
    itemBase: {
      color: theme.colors.text.primary.onPrimary,
    },
    labelStyle: {
      color: theme.colors.text.primary.onPrimary
    }
  })
}