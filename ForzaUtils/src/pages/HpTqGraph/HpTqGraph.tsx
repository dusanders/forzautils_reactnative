import React, {  } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { Assets } from "../../assets";
import { Paper } from "../../components/Paper";
import { AppBarContainer } from "../../components/AppBarContainer";
import { ThemeText } from "../../components/ThemeText";
import { randomKey } from "../../constants/types";
import { HpTqCurves } from "./HpTqCurves";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";
import { withScaledWindow } from "../../hooks/withScaledWindow";

export interface HpTqGraphProps {
  // Nothing
}

export function HptqGraph(props: HpTqGraphProps) {
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const store = useViewModelStore();
  const windowMeasure = withScaledWindow(0.9, 1);

  const separator = () => {
    return (
      <View style={{
        height: 5
      }}></View>
    )
  }

  return (
    <AppBarContainer title="Hp / Tq Graph"
      onBack={() => {
        navigation.goBack()
      }}
      injectElements={[
        {
          id: randomKey(),
          onPress: () => {
            store.hpTqGraph.clearCache();
          },
          renderItem: () => (
            <ThemeText
              allcaps
              fontFamily={'bold'}>
              Clear Data
            </ThemeText>
          )
        },
      ]}>
      <View
        style={styles.contentWrapper}>
        {store.hpTqGraph.gears.length < 1 && (
          <Paper style={styles.waitPaper}>
            <ThemeText
              fontFamily="bold"
              allcaps
              fontSize="large"
              style={styles.waitTitleText}>
              Awaiting Data
            </ThemeText>
            <ThemeText style={styles.waitBodyText}>
              No data received from Forza. Please drive in-game.
            </ThemeText>
            <ActivityIndicator />
          </Paper>
        )}
        {store.hpTqGraph.gears.length > 0 && (

          <FlatList
            ItemSeparatorComponent={separator}
            style={{
              flexGrow: 1
            }}
            data={store.hpTqGraph.gears}
            keyExtractor={(item) => `${item.gear}`}
            // renderItem={renderItem}
            renderItem={(item) => {
              return (
                <HpTqCurves
                  gear={item.item.gear}
                  data={item.item.events}
                  width={windowMeasure.width} />
              )
            }}
          />

        )}
      </View>
    </AppBarContainer>
  )
}

function themeStyles(theme: IThemeElements) {
  return StyleSheet.create({
    waitBodyText: {
      width: '70%',
      textAlign: 'center',
      margin: 'auto',
      marginBottom: 20
    },
    waitTitleText: {
      textAlign: 'center',
      marginBottom: 12
    },
    waitPaper: {
      width: '80%'
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    yAxisText: {
      color: theme.colors.text.secondary.onPrimary,
      fontFamily: Assets.SupportedFonts.Regular
    },
    xAxisText: {
      color: theme.colors.text.primary.onPrimary,
      fontFamily: Assets.SupportedFonts.Regular
    }
  })
}