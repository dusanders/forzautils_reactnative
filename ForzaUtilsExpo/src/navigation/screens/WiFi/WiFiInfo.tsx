import { AppBarContainer } from "@/components/AppBar/AppBarContainer";
import { CircleCheckIcon } from "@/components/CircleCheckIcon";
import { Row } from "@/components/Row";
import { TextCard } from "@/components/TextCard";
import { ThemeButton } from "@/components/ThemeButton";
import { ThemeIcon, ThemeIconNames } from "@/components/ThemeIcon";
import { TitleText, LabelText, ThemeText } from "@/components/ThemeText";
import { AppRoutes, MainAppNavigation } from "@/navigation/types";
import { useNetworkService } from "@/services/Forza/NetworkService";
import { useWifiContext } from "@/services/WiFiInfo/WiFiInfoService";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, View } from "react-native";

export interface WiFiInfoProps {

}

export function WiFiInfo(props: WiFiInfoProps): React.ReactElement<WiFiInfoProps> {
  const styles = themeStyles();
  const wifi = useWifiContext();
  const network = useNetworkService();
  const navigation = useNavigation<MainAppNavigation>();
  
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
              <ThemeIcon name={ThemeIconNames.SEARCH} />
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
              title={wifi.wifiState.ipAddress || '-'}
              body="IP Address" />
            <TextCard
              allcapsLabel
              allcapsTitle
              centerContent
              title={`${network.port || '-'}`}
              body="Port" />
          </Row>
          <Row>
            <TextCard
              allcapsLabel
              allcapsTitle
              centerContent
              title={`${network.isUDPListening() ? 'Listening' : 'Error'}`}
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
  );
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