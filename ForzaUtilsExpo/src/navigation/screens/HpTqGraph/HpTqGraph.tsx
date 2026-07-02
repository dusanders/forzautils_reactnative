import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Paper } from "@/components/Paper";
import { AppBarContainer } from "@/components/AppBar/AppBarContainer";
import { ThemeText } from "@/components/ThemeText";
import { HpTqCurves } from "./HpTqCurves";
import { useThemeContext } from "@/theme/ThemeProvider";
import { IThemeElements } from "@/theme/Themes";
import { Assets } from "@/assets";
import { percentOfDeviceWidth } from "@/helpers/misc";
import { useHpTqViewModel } from "@/viewModels/HpTq/HpTqViewModel";

export interface HpTqGraphProps {
  // Nothing
}

export function HpTqGraph(props: HpTqGraphProps) {
  const theme = useThemeContext();
  const styles = themeStyles(theme.theme);
  const viewModel = useHpTqViewModel();
  const [cacheCleared, setCacheCleared] = React.useState(false);

  const separator = () => {
    return (
      <View style={{
        height: 5
      }}></View>
    )
  }

  return (
    <AppBarContainer title="Hp / Tq Graph"
      injectElements={[
        {
          id: 'clear-hp-cache',
          onPress: () => {
            viewModel.clearCache();
            setCacheCleared(!cacheCleared);
          },
          renderItem: () => (
            <TouchableOpacity
              onPress={() => {
                viewModel.clearCache();
                setCacheCleared(!cacheCleared);
              }}>
              <ThemeText
                allcaps
                fontFamily={'bold'}
                variant={'error'}>
                Clear Data
              </ThemeText>
            </TouchableOpacity>
          )
        },
      ]}>
      <View
        style={styles.contentWrapper}>
        {viewModel.gears.size < 1 && (
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
        {viewModel.gears.size > 0 && (
          <FlatList
            ItemSeparatorComponent={separator}
            style={{
              flexGrow: 1
            }}
            data={
              Array.from(
                viewModel.gears.entries()
              ).sort(([gearA], [gearB]) => gearA - gearB)
                .map(([gear, events]) => (
                  {
                    gear,
                    events: Array.from(events.values())
                  }
                ))
            }
            keyExtractor={(item) => `${item.gear}`}
            // renderItem={renderItem}
            renderItem={(item) => {
              return (
                <HpTqCurves
                  gear={item.item.gear}
                  data={item.item.events}
                  width={percentOfDeviceWidth(90)} />
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
  });
}