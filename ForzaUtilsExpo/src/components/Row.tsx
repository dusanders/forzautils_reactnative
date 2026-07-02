import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export interface RowProps {
  children?: any;
  style?: StyleProp<ViewStyle>;
}

export function Row(props: RowProps) {
  return (
    <View style={[{
      display: 'flex',
      flexDirection: 'row',
      width: '100%'
    }, props.style]}>
      {props.children}
    </View>
  )
}