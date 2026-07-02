import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { AppRoutes, MainStack } from './navigation/types';
import { NotFound } from './navigation/screens/NotFound';
import { useOnMount } from './hooks/useOnMount';
import { Logger } from './hooks/Logger';
import { WiFiInfo } from './navigation/screens/WiFi/WiFiInfo';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SourceChooser } from './navigation/screens/SourceChooser/SourceChooser';
import { Settings } from './navigation/screens/Settings/Settings';
import { TuningPage } from './navigation/screens/Tuning/Tuning';
import { ReplayList } from './navigation/screens/Replay/ReplayList';
import { DataChooser } from './navigation/screens/DataChooser/DataChooser';
import { Grip } from './navigation/screens/Grip/Grip';
import { SuspensionTravel } from './navigation/screens/Suspension/SuspensionTravel';
import { TireTemps } from './navigation/screens/TireTemps/TireTemps';
import { HpTqGraph } from './navigation/screens/HpTqGraph/HpTqGraph';

SplashScreen.preventAutoHideAsync();

const TAG = "App.tsx";
function App() {
  useOnMount(() => {
    SplashScreen.hideAsync().catch((e) => {
      Logger.error(TAG, `Error hiding splash screen: ${e}`);
    });
  });
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <MainStack.Navigator
            initialRouteName={AppRoutes.WIFI_INFO}
            screenOptions={{ headerShown: false }}>
            <MainStack.Screen
              name={AppRoutes.WIFI_INFO}
              component={WiFiInfo} />
            <MainStack.Screen
              name={AppRoutes.WIFI_ERROR}
              component={WiFiInfo} />
            <MainStack.Screen
              name={AppRoutes.SOURCE_CHOOSER}
              component={SourceChooser} />
            <MainStack.Screen
              name={AppRoutes.SETTINGS}
              component={Settings} />
            <MainStack.Screen
              name={AppRoutes.TUNING_CALCULATOR}
              component={TuningPage} />
            <MainStack.Screen
              name={AppRoutes.REPLAY_LIST}
              component={ReplayList} />
            <MainStack.Screen
              name={AppRoutes.DATA}
              component={DataChooser} />
            <MainStack.Screen
              name={AppRoutes.GRIP}
              component={Grip} />
            <MainStack.Screen
              name={AppRoutes.SUSPENSION_GRAPH}
              component={SuspensionTravel} />
            <MainStack.Screen
              name={AppRoutes.TIRE_TEMPS}
              component={TireTemps} />
            <MainStack.Screen
              name={AppRoutes.HP_TQ_GRAPH}
              component={HpTqGraph} />
            <MainStack.Screen
              name={AppRoutes.NOT_FOUND}
              component={NotFound}
              options={{
                title: '404'
              }} />
          </MainStack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;