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

SplashScreen.preventAutoHideAsync();

const TAG = "App.tsx";
export function App() {
  useOnMount(() => {
    SplashScreen.hideAsync().catch((e) => {
      Logger.error(TAG, `Error hiding splash screen: ${e}`);
    });
  });
  return (
    <NavigationContainer>
      <MainStack.Navigator
        initialRouteName={AppRoutes.HOME}
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
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
