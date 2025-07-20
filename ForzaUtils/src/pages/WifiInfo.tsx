import React from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, View } from "react-native";
import { LabelText, ThemeText, TitleText } from "../components/ThemeText";
import { AppRoutes, StackNavigation } from "../constants/types";
import { TextCard } from "../components/TextCard";
import { ThemeButton } from "../components/ThemeButton";
import { ThemeIcon } from "../components/ThemeIcon";
import { AppBarContainer } from "../components/AppBar/AppBarContainer";
import { Row } from "../components/Row";
import { useNavigation } from "@react-navigation/native";
import { CircleCheckIcon } from "../components/CircleCheckIcon";
import { wifiService } from "../hooks/WifiState";
import { localeService } from "../hooks/LocaleState";

export interface WifiInfoProps {
  // None
}

export function WifiInfo(props: WifiInfoProps): React.ReactElement<WifiInfoProps> {
  const tag = "WifiInfo.tsx";
  const wifiVm = wifiService();
  const styles = themeStyles();
  const navigation = useNavigation<StackNavigation>();
  const localeVM = localeService();

  return (
    <AppBarContainer hideBack>
      <View style={{ margin: 23 }}></View>
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
              <ThemeIcon name={'wifi' + i.item} />
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
              allcapsLabel
              allcapsTitle
              centerContent
              title={wifiVm.wifi.ip || '-'}
              body="IP Address" />
            <TextCard
              allcapsLabel
              allcapsTitle
              centerContent
              title={`${wifiVm.wifi.port || '-'}`}
              body="Port" />
          </Row>
          <Row>
            <TextCard
              allcapsLabel
              allcapsTitle
              centerContent
              title={wifiVm.wifi.isUdpListening ? 'Listening' : 'Error'}
              body="Forza Data" />
            <TextCard
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

function themeStyles() {
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