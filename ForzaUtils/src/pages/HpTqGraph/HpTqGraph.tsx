import React, { memo, useCallback, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { Assets } from "../../assets";
import { GearData } from "../../context/viewModels/HpTqGraphViewModel";
import { Paper } from "../../components/Paper";
import { AppBarContainer } from "../../components/AppBarContainer";
import { ThemeText } from "../../components/ThemeText";
import { randomKey } from "../../constants/types";
import { HpTqCurves } from "./HpTqCurves";
import { useViewModelStore } from "../../context/viewModels/ViewModelStore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../constants/types";

export interface HpTqGraphProps {

}

export function HptqGraph(props: HpTqGraphProps) {
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const store = useViewModelStore();
  const [graphWidth, setGraphWidth] = useState(Dimensions.get('window').width - 40);

  const separator = () => {
    return (
      <View style={{
        height: 5
      }}></View>
    )
  }

  const CurveMemo = memo((props: { item: GearData }) => {
    console.log(`render curve`)
    return (
      <HpTqCurves
        width={graphWidth}
        key={randomKey()}
        data={props.item.events}
        gear={props.item.gear} />

    )
  }, (prev, next) => {
    return prev.item.events.length === next.item.events.length
  });

  const renderItem = useCallback((item: ListRenderItemInfo<GearData>) => {
    return (
      <CurveMemo item={item.item} />
    )
  }, [store.hpTqGraph.gears]);


  console.log(`render parent`)
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
            renderItem={renderItem} />
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