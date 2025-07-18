import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { IThemeElements } from "../../constants/Themes";
import { Picker } from "@react-native-picker/picker";
import { themeService } from "../../hooks/ThemeState";

export interface IDropdownOption {
  label: string;
  value: any;
}

export interface DropdownProps {
  value: IDropdownOption['value'];
  options: IDropdownOption[];
  onValueChanged(option: IDropdownOption): void;
}

export function Dropdown(props: DropdownProps) {
  const theme = themeService().theme;
  const styles = themeStyles(theme);
  const [value, setValue] = useState(props.value);

  return (
    <Picker
      itemStyle={styles.itemBase}
      selectedValue={value}
      onValueChange={(ev) => {
        const selectedOption = props.options.find(i => i.value === ev);
        if(selectedOption) {
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
  )
}
function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    itemBase: {
      color: theme.colors.text.primary.onPrimary,
    },
    labelStyle: {
      color: theme.colors.text.primary.onPrimary
    }
  })
}