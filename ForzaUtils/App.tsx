import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';

import { LocaleContextHoc } from './src/context/Locale';
import { AppRoutes } from './src/constants/types';
import { Preflight } from './src/pages/Preflight';
import { ThemeProvider } from './src/context/Theme';
import { WifiInfo } from './src/pages/WifiInfo';
import { NavigationProvider } from './src/context/Navigator';
import { Splash } from './src/pages/Splash';
import { DataChooser } from './src/pages/DataChooser';
import { ViewModelStore, ViewModelStore_Hoc } from './src/context/viewModels/ViewModelStore';
import { HptqGraph } from './src/pages/HpTqGraph/HpTqGraph';
import { SuspensionTravel } from './src/pages/SuspensionTravel/SuspensionTravel';


function App(): React.JSX.Element {
  const colorScheme = useColorScheme();

  const isDarkTheme = () => {
    return colorScheme == 'dark';
  }
  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkTheme() ? 'light-content' : 'dark-content'}
      />
      {/** Provide a Locale Context API */}
      <LocaleContextHoc>
        {/** Provide a Theme Context API */}
        <ThemeProvider initialMode={colorScheme}>
          {/** Preflight - check permissions, initial WiFi info, etc */}
          <Preflight>
            {/** View model store to preserve states across page changes */}
            <ViewModelStore_Hoc>
              <ViewModelStore.Consumer>
                {viewModelStore => (
                  <NavigationProvider
                    initialRoute={AppRoutes.IP_INFO}>
                    <WifiInfo route={AppRoutes.IP_INFO} />
                    <DataChooser route={AppRoutes.DATA} />
                    <HptqGraph route={AppRoutes.HP_TQ_GRAPH}
                      viewModel={viewModelStore.hpTqGraph} />
                    <SuspensionTravel route={AppRoutes.SUSPENSION_GRAPH}
                      viewModel={viewModelStore.suspensionGraph} />
                  </NavigationProvider>
                )}
              </ViewModelStore.Consumer>
            </ViewModelStore_Hoc>
          </Preflight>
        </ThemeProvider>
      </LocaleContextHoc>
    </SafeAreaView>
  );
}

export default App;
