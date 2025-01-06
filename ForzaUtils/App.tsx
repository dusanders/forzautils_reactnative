import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';

import { Splash } from './src/pages/Splash/Splash';
import { LocaleContext, LocaleContextHoc } from './src/context/withLocale';
import { withTheme } from './src/hooks/withTheme';
import { BottomNavigation } from './src/components/bottomNavigation/BottomNavigation';
import { AppBottomBar } from './src/components/appBottomBar/AppBottomBar';
import { AppRoutes } from './src/constants/types';


function App(): React.JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [route, setRoute] = useState(AppRoutes.IP_INFO);
  const colorScheme = useColorScheme();
  const colors = withTheme(colorScheme);
  const isDarkMode = colorScheme === 'dark';
  const backgroundStyle = {
    backgroundColor: colors.background,
  };

  setTimeout(() => {
    setLoaded(true)
  }, 2000);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <LocaleContextHoc>
        <LocaleContext.Consumer>
          {locale => (
            <>
              {!loaded && (
                <Splash
                  theme={colorScheme}
                  locale={locale} />
              )}
              {loaded && (
                <BottomNavigation
                  theme={colorScheme}
                  bottomRow={(
                    <AppBottomBar
                      theme={colorScheme}
                      onDataClick={() => {
                        setRoute(AppRoutes.DATA)
                      }}
                      onIpInfoClick={() => {
                        setRoute(AppRoutes.IP_INFO)
                      }} />
                  )}>
                  {route == AppRoutes.IP_INFO && (
                    <View>

                    </View>
                  )}
                  {route == AppRoutes.DATA && (
                    <View>

                    </View>
                  )}
                </BottomNavigation>
              )}
            </>
          )}
        </LocaleContext.Consumer>
      </LocaleContextHoc>
    </SafeAreaView>
  );
}

export default App;
