import React from 'react';
import {
  useColorScheme,
  View,
} from 'react-native';

import { AppRoutes, RootStackParamList } from './src/constants/types';
import { WifiInfo } from './src/pages/WifiInfo';
import { DataChooser } from './src/pages/DataChooser';
import { HptqGraph } from './src/pages/HpTqGraph/HpTqGraph';
import { SuspensionTravel } from './src/pages/SuspensionTravel/SuspensionTravel';
import { TireTemps } from './src/pages/TireTemps/TireTemps';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Grip } from './src/pages/Grip/Grip';
import { SourceChooser } from './src/pages/SourceChooser';
import { TuningPage } from './src/pages/Tuning/Tuning';
import { ReplayList } from './src/pages/ReplayList/ReplayList';
import { Settings } from './src/pages/Settings/Settings';

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
  return (
    <SafeAreaProvider style={{ backgroundColor: "#000" }}>
      <NavigationContainer>
        <SafeStack>
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
            <Stack.Screen
              name={AppRoutes.REPLAY_LIST}
              component={ReplayList}
              initialParams={{listId: 'none'}} />
            <Stack.Screen
              name={AppRoutes.SETTINGS}
              component={Settings} />
          </Stack.Navigator>
        </SafeStack>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
