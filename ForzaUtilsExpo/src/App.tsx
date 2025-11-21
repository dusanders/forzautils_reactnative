import 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { AppRoutes, MainStack } from './navigation/types';
import { Home } from './navigation/screens/Home';
import { Explore } from './navigation/screens/Explore';
import { NotFound } from './navigation/screens/NotFound';
import { useOnMount } from './hooks/useOnMount';
import { Logger } from './hooks/Logger';
import { WiFiInfo } from './navigation/screens/WiFi/WiFiInfo';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SourceChooser } from './navigation/screens/SourceChooser/SourceChooser';
import { Settings } from './navigation/screens/Settings/Settings';

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
              name={AppRoutes.HOME}
              component={Home} />
            <MainStack.Screen
              name={AppRoutes.EXPLORE}
              component={Explore} />
            <MainStack.Screen
              name={AppRoutes.NOT_FOUND}
              component={NotFound}
              options={{
                title: '404'
              }} />
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
          </MainStack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;