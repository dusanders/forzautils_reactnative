import React, { Consumer } from "react";
import { Container } from "../components/Container";
import { useNavigation } from "../hooks/useNavigation";
import { AppBar } from "../components/AppBar";
import { View } from "react-native";
import { INavigationTarget } from "../context/Navigator";
import { ILocaleContext } from "../context/Locale";

export interface HpTqGraphProps extends INavigationTarget {

}

export function HptqGraph(props: HpTqGraphProps) {
  const navigation = useNavigation();
  return (
    <Container>
      <AppBar title="Hp / Tq Graph"
        onBack={() => {
          navigation.goBack()
        }} />
      <View>

      </View>
    </Container>
  )
}