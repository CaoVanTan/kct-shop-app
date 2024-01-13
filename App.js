import { Provider } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { enableLatestRenderer } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

import i18n from './src/configs/i18n';
import { AuthenticationProvider } from './src/context/Authentication';
import AppContainer from './src/routes';
import { AnimatedSplash } from './src/screens';
import { exitAlert } from './src/utils/androidBackButton';
import store from './src/redux/store';
import { hasLocationPermission } from './src/services/Location';
import { GOOGLE_API_KEY } from './src/configs/environment';
import { createChannel } from './src/services/Notification';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadAppData();
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', exitAlert);
    };
  }, []);

  async function loadAppData() {
    await i18n.initAsync();
    await hasLocationPermission();

    createChannel();
    enableLatestRenderer();
    Geocoder.init(GOOGLE_API_KEY);

    BackHandler.addEventListener('hardwareBackPress', exitAlert);
    setIsLoaded(true);
  }

  if (isLoaded) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={isDark ? 'light-content' : 'dark-content'}
        />

        <Provider store={store}>
          <AuthenticationProvider>
            <AppContainer />
          </AuthenticationProvider>
        </Provider>
        <FlashMessage duration={2000} position="center" />
      </View>
    );
  }
}
