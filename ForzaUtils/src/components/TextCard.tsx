import React from "react";
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { LabelText, TitleText } from "./ThemeText";
import { CardContainer } from "./CardContainer";

export interface CardProps {
  id?: string;
  children?: any;
  style?: ViewStyle;
  titleStyle?: StyleProp<TextStyle>;
  title?: string;
  body?: string;
  bodyStyle?: StyleProp<TextStyle>;
  allcapsTitle?: boolean;
  allcapsLabel?: boolean;
  centerContent?: boolean;
  onPress?: (id?: string) => void;
}

export function TextCard(props: CardProps) {
  const centerContentStyle: StyleProp<ViewStyle> = {
    justifyContent: 'center',
    alignItems: 'center'
  }
  return (
    <CardContainer 
      style={{
        width: '50%',
        ...props.style
      }}
      centerContent={props.centerContent}>
      <TouchableOpacity
        disabled={!Boolean(props.onPress)}
        style={[
          props.centerContent ? centerContentStyle : {},
          {
            display: 'flex',
            flexDirection: 'column',
          }
        ]}
        onPress={() => {
          if (props.onPress) {
            props.onPress(props.id)
          }
        }}>
        <TitleText
          style={props.titleStyle}
          allcaps={props.allcapsTitle}
          fontSize={'small'}>
          {props.title}
        </TitleText>
        {props.body && (
          <LabelText
            style={props.bodyStyle}
            allcaps={props.allcapsLabel}>
            {props.body}
          </LabelText>
        )}
        {props.children}
      </TouchableOpacity>
    </CardContainer>
  )
}