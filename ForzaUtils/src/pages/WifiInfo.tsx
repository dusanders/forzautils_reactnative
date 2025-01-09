import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { IThemeElements } from "../constants/Themes";
import { LabelText, ThemeText, TitleText } from "../components/ThemeText";
import { INavigationTarget } from "../context/Navigator";
import { AppRoutes } from "../constants/types";
import { useNavigation } from "../hooks/useNavigation";
import { useForzaData } from "../hooks/useForzaData";
import { Card } from "../components/Card";
import { ThemeButton } from "../components/ThemeButton";
import { ThemeIcon } from "../components/ThemeIcon";
import { AppBar } from "../components/AppBar";
import { AppBarContainer } from "../components/AppBarContainer";

export interface WifiInfoProps extends INavigationTarget {

}

interface RowProps {
  children?: any;
}
function Row(props: RowProps) {
  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%'
    }}>
      {props.children}
    </View>
  )
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
  const navigation = useNavigation();
  const forza = useForzaData();

  return (
    <AppBarContainer hideBack>
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
            <Card
              style={{
                width: '50%'
              }}
              allcapsLabel
              allcapsTitle
              centerContent
              title={forza.ip}
              body="IP Address" />
            <Card
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
            <Card
              style={{
                width: '50%'
              }}
              allcapsLabel
              centerContent
              title={forza.ssid}
              body="WiFi Name" />
            <Card
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
            navigation.navigateTo(AppRoutes.DATA);
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