import React from 'react';
import {
  useColorScheme,
  View,
} from 'react-native';

import { AppRoutes, RootStackParamList } from './src/constants/types';
import { WifiInfo } from './src/pages/WifiInfo';
import { DataChooser } from './src/pages/DataChooser';
import { ViewModelStore_Hoc } from './src/context/viewModels/ViewModelStore';
import { HptqGraph } from './src/pages/HpTqGraph/HpTqGraph';
import { SuspensionTravel } from './src/pages/SuspensionTravel/SuspensionTravel';
import { TireTemps } from './src/pages/TireTemps/TireTemps';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Grip } from './src/pages/Grip/Grip';
import { SourceChooser } from './src/pages/SourceChooser';
import { TuningPage } from './src/pages/Tuning';

const Stack = createNativeStackNavigator<RootStackParamList>();

function SafeStack(props: { children?: any }) {
  const safeArea = useSafeAreaInsets();
  return (
    <View style={{
      height: '100%',
      width: '100%',
      paddingTop: safeArea.top,
      paddingBottom: safeArea.bottom,
      paddingLeft: safeArea.left,
      paddingRight: safeArea.right
    }}>
      {props.children}
    </View>
  )
}
function App(): React.JSX.Element {
  const colorScheme = useColorScheme();
  const isDarkTheme = () => {
    return colorScheme == 'dark';
  }
  return (
    <SafeAreaProvider style={{ backgroundColor: "#000" }}>
      <NavigationContainer>
        <SafeStack>
          <ViewModelStore_Hoc>
            <Stack.Navigator
              initialRouteName={AppRoutes.IP_INFO}
              screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name={AppRoutes.IP_INFO}
                component={WifiInfo} />
              <Stack.Screen
                name={AppRoutes.DATA}
                component={DataChooser} />
              <Stack.Screen
                name={AppRoutes.HP_TQ_GRAPH}
                component={HptqGraph} />
              <Stack.Screen
                name={AppRoutes.SUSPENSION_GRAPH}
                component={SuspensionTravel} />
              <Stack.Screen
                name={AppRoutes.TIRE_TEMPS}
                component={TireTemps} />
              <Stack.Screen
                name={AppRoutes.GRIP}
                component={Grip} />
              <Stack.Screen
                name={AppRoutes.SOURCE_CHOOSER}
                component={SourceChooser} />
              <Stack.Screen
                name={AppRoutes.TUNING_CALCULATOR}
                component={TuningPage} />
            </Stack.Navigator>
          </ViewModelStore_Hoc>
        </SafeStack>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
