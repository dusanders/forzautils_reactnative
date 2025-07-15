import React, { useEffect } from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, View } from "react-native";
import { IThemeElements } from "../constants/Themes";
import { LabelText, ThemeText, TitleText } from "../components/ThemeText";
import { AppRoutes, StackNavigation } from "../constants/types";
import { TextCard } from "../components/TextCard";
import { ThemeButton } from "../components/ThemeButton";
import { ThemeIcon } from "../components/ThemeIcon";
import { AppBarContainer } from "../components/AppBar/AppBarContainer";
import { Row } from "../components/Row";
import { useNavigation } from "@react-navigation/native";
import { CircleCheckIcon } from "../components/CircleCheckIcon";
import { useAtomValue } from "jotai";
import { wifiState } from "../hooks/WifiState";
import { useCurrentTheme } from "../hooks/ThemeState";
import { useLocaleViewModel } from "../redux/LocaleStore";
import { ISupportLocale } from "../locale/strings";

export interface WifiInfoProps {
  // None
}

export function WifiInfo(props: WifiInfoProps): React.ReactElement<WifiInfoProps> {
  const tag = "WifiInfo.tsx";
  const theme = useCurrentTheme();
  const wifiInfo = useAtomValue(wifiState);
  const styles = themeStyles(theme);
  const navigation = useNavigation<StackNavigation>();
  const localeVM = useLocaleViewModel();
  const currentLocale = localeVM.locale;
  
  useEffect(() => {
    console.log(`${tag} - currentLocale changed: ${currentLocale}`);
  }, [currentLocale]);

  useEffect(() => {
    console.log(`${tag} - Setting locale to French`);
    localeVM.setLocale(ISupportLocale.fr);
  }, []);

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
              title={wifiInfo.ip || '-'}
              body="IP Address" />
            <TextCard
              allcapsLabel
              allcapsTitle
              centerContent
              title={`${wifiInfo.port || '-'}`}
              body="Port" />
          </Row>
          <Row>
            <TextCard
              allcapsLabel
              allcapsTitle
              centerContent
              title={wifiInfo.isUdpListening ? 'Listening' : 'Error'}
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