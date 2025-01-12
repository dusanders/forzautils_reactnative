import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, ListRenderItemInfo, ScaledSize, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { IThemeElements } from "../../constants/Themes";
import { Assets } from "../../assets";
import { DataEvent, GearData } from "../../context/viewModels/HpTqGraphViewModel";
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

interface CurvesMemoProps {
  gear: number;
  events: DataEvent[];
  width: number;
}
const CurveMemo = memo((props: CurvesMemoProps) => {
  console.log(`render curve ${props.gear} ${JSON.stringify(props.events.length)}`)
  return (
    <HpTqCurves
      width={props.width}
      data={props.events}
      gear={props.gear} />
  )
});

function getScaledWidth(window: ScaledSize) {
  const measure = window.width > window.height
    ? window.width - 100
    : window.width;
  return measure * 0.9;
}

export function HptqGraph(props: HpTqGraphProps) {
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme();
  const styles = themeStyles(theme.theme);
  const store = useViewModelStore();
  const [graphWidth, setGraphWidth] = useState(
    getScaledWidth(Dimensions.get('window'))
  );


  const separator = () => {
    return (
      <View style={{
        height: 5
      }}></View>
    )
  }

  useEffect(() => {
    store.hpTqGraph.DEBUG_StartStream();
    const handleOrientation = Dimensions.addEventListener('change',
      (ev: { window: ScaledSize, screen: ScaledSize }) => {
        setGraphWidth(
          getScaledWidth(ev.window)
        )
      }
    );
    return () => {
      handleOrientation.remove();
    }
  }, []);

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
            keyExtractor={(item) => `${item.gear}`}
            // renderItem={renderItem}
            renderItem={(item) => {
              return (
                <CurveMemo
                  gear={item.item.gear}
                  events={item.item.events}
                  width={graphWidth} />
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