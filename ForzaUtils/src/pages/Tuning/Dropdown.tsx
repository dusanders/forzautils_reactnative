import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { getTheme } from "../../redux/ThemeStore";
import { IThemeElements } from "../../constants/Themes";
import { Picker, PickerIOS } from "@react-native-picker/picker";

export interface IDropdownOption {
  label: string;
  value: any;
}

export interface DropdownProps {
  options: IDropdownOption[];
  onValueChanged(option: IDropdownOption): void;
}

export function Dropdown(props: DropdownProps) {
  const theme = useSelector(getTheme);
  const styles = themeStyles(theme);
  const [value, setValue] = useState(props.options[0].value);

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