import React, { useState } from "react";
import { Button, Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../context/Theme";
import { IThemeElements } from "../constants/Themes";
import { LabelText, ThemeText, TitleText } from "../components/ThemeText";
import { AppRoutes, StackNavigation } from "../constants/types";
import { useForzaData } from "../hooks/useForzaData";
import { TextCard } from "../components/TextCard";
import { ThemeButton } from "../components/ThemeButton";
import { ThemeIcon } from "../components/ThemeIcon";
import { AppBarContainer } from "../components/AppBarContainer";
import { Row } from "../components/Row";
import { useNavigation } from "@react-navigation/native";

export interface WifiInfoProps {
  // None
}

interface CircleCheckIconProps {

}
function CircleCheckIcon(props: CircleCheckIconProps) {
  const theme = useTheme();
  return (
    <View style={{
      height: 50,
      width: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        borderColor: theme.theme.colors.text.primary.onPrimary,
        borderRadius: 100,
        borderWidth: 0.8,
        position: 'absolute',
        height: '100%',
        width: '100%',
        opacity: 0.25
      }}></View>
      <ThemeIcon name={'check'} />
    </View>
  )
}

export function WifiInfo(props: WifiInfoProps): React.ReactElement<WifiInfoProps> {
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const navigation = useNavigation<StackNavigation>();
  const forza = useForzaData();
  const i = useState('')

  return (
    <AppBarContainer hideBack>
      <View style={{margin: 23}}></View>
      <FlatList
      data={[]}
      renderItem={(i) => {
        return (
          <View style={{
            height: 50,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ThemeIcon name={'wifi'+ i.item} />
          </View>
        )
      }}>

      </FlatList>
      <ScrollView bounces={false}>
        <View style={styles.content}>
          <View style={styles.messageView}>
            <TitleText allcaps>
              Forward Forza Telemetry
            </TitleText>
            <LabelText>
              Setup Forza's Telemetry output to go to the below IP and Port. Use DASH format.
            </LabelText>
          </View>
          <View style={styles.messageView}>
            <TitleText allcaps>
              important!
            </TitleText>
            <LabelText>
              If using SimHub, configure SimHub to forward the data to the device instead of adjusting in-game values.
            </LabelText>
          </View>
          <Row>
            <TextCard
              style={{
                width: '50%'
              }}
              allcapsLabel
              allcapsTitle
              centerContent
              title={forza.ip}
              body="IP Address" />
            <TextCard
              style={{
                width: '50%'
              }}
              allcapsLabel
              allcapsTitle
              centerContent
              title={`${forza.port}`}
              body="Port" />
          </Row>
          <Row>
            <TextCard
              style={{
                width: '50%'
              }}
              allcapsLabel
              centerContent
              title={forza.ssid}
              body="WiFi Name" />
            <TextCard
              style={{
                width: '50%'
              }}
              allcapsLabel
              allcapsTitle
              centerContent
              title="dash"
              body="Telemetry format" />
          </Row>
        </View>
        <ThemeButton
          style={styles.doneBtn}
          onPress={() => {
            navigation.push(AppRoutes.SOURCE_CHOOSER);
          }}>
          <CircleCheckIcon />
          <ThemeText
            style={{
              fontWeight: 700,
              marginTop: 10
            }}>
            Done
          </ThemeText>
        </ThemeButton>
      </ScrollView>
    </AppBarContainer>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    content: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    doneBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: Dimensions.get('window').height * 0.1
    },
    messageView: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      marginBottom: 30
    }
  })
}