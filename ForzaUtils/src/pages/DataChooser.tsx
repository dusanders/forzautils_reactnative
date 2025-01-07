import React from "react";
import { Pressable, View } from "react-native";
import { ThemeText } from "../components/ThemeText";
import { INavigationTarget } from "../context/Navigator";
import { AppRoutes } from "../constants/types";
import { useNavigation } from "../hooks/useNavigation";
import { useForzaData } from "../hooks/useForzaData";

export interface DataChooserProps extends INavigationTarget {

}

export function DataChooser(props: DataChooserProps) {
  const navigation = useNavigation();
  const forzaData = useForzaData();
  
  return (
    <View>
      <Pressable onPress={() => {
        navigation.goBack();
      }}>
        <ThemeText>
          Back
        </ThemeText>
      </Pressable>
      <Pressable onPress={() => {
        navigation.navigateTo(AppRoutes.IP_INFO)
      }}>
        <ThemeText>
          NEXT
        </ThemeText>
      </Pressable>
      <ThemeText>
        DATA CHOOSER
      </ThemeText>
    </View>
  )
}