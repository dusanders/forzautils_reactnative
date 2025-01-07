import { NetInfoStateType, useNetInfo } from "@react-native-community/netinfo";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { IThemeElements } from "../constants/Themes";
import { ThemeText } from "../components/ThemeText";
import { INavigationTarget } from "../context/Navigator";
import { AppRoutes } from "../constants/types";
import { useNavigation } from "../hooks/useNavigation";
import { useForzaData } from "../hooks/useForzaData";
import { Card } from "../components/Card";
import { ThemeButton } from "../components/ThemeButton";
import { ThemeIcon } from "../components/ThemeIcon";

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
      justifyContent: 'space-evenly'
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
        borderColor: theme.theme.colors.text.primary,
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

function TitleText(props: { children?: any; allcaps?: boolean }) {
  return (
    <ThemeText
      fontFamily={'bold'}
      style={{
        fontSize: 18,
        textTransform: props.allcaps ? 'uppercase' : 'none',
      }}>
      {props.children}
    </ThemeText>
  )
}
function LabelText(props: { children?: any; allcaps?: boolean }) {
  return (
    <ThemeText
      fontFamily={'light'}

      style={{
        marginTop: 0,
        textTransform: props.allcaps ? 'uppercase' : 'none',
        letterSpacing: 1,
        opacity: 0.5
      }}>
      {props.children}
    </ThemeText>
  )
}
interface DataCardProps {
  value: string;
  label: string;
  allcapsTitle?: boolean;
  allcapsLabel?: boolean;
}
function DataCard(props: DataCardProps) {
  return (
    <Card style={{ width: '50%' }}>
      <TitleText allcaps={props.allcapsTitle ?? true}>
        {props.value}
      </TitleText>
      <LabelText allcaps={props.allcapsLabel ?? true}>
        {props.label}
      </LabelText>
    </Card>
  )
}
export function WifiInfo(props: WifiInfoProps): React.ReactElement<WifiInfoProps> {
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const navigation = useNavigation();
  const forza = useForzaData();
  const netInfo = useNetInfo();
  let ipString = '';
  if (netInfo.type == NetInfoStateType.wifi) {
    console.log(`${netInfo.details.bssid} - ${netInfo.details.ssid}`)
  }
  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <View style={styles.messageView}>
          <TitleText allcaps>
            Forward Forza Telemetry
          </TitleText>
          <LabelText allcaps>
            Setup Forza's Telemetry output to go to the below IP and Port. Use DASH format.
          </LabelText>
        </View>
        <View style={styles.messageView}>
          <TitleText allcaps>
            important!
          </TitleText>
          <LabelText allcaps>
            If using SimHub, configure SimHub to forward the data to the device instead of adjusting in-game values.
          </LabelText>
        </View>
        <Row>
          <DataCard
            value={forza.ip}
            label="IP Address" />
          <DataCard
            value={`${forza.port}`}
            label="Port" />
        </Row>
        <Row>
          <DataCard
            allcapsTitle={false}
            value={forza.ssid}
            label="WiFi Name" />
          <DataCard
            value="dash"
            label="Telemetry format" />
        </Row>
      </View>
      <ThemeButton
        style={styles.doneBtn}
        onPress={() => {
          navigation.navigateTo(AppRoutes.DATA);
        }}>
        <CircleCheckIcon />
        <ThemeText style={{ fontWeight: 700, marginTop: 10 }}>
          Done
        </ThemeText>
      </ThemeButton>
    </View>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    root: {
      backgroundColor: theme.colors.background.primary,
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    doneBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: '25%'
    },
    messageView: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      marginBottom: 30
    }
  })
}