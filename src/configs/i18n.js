import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18n-js';
import { Platform } from 'react-native';
import * as Localize from 'react-native-localize';
import { vn } from '../translations/vn';
import { en } from '../translations/en';

i18n.initAsync = async () => {
  i18n.fallbacks = true;
  i18n.translations = { vn, en };

  if (Platform.OS === 'android') {
    const lang = await AsyncStorage.getItem('language');
    i18n.locale = lang || 'vn';
  } else {
    const locales = Localize.getLocales();
    i18n.locale = locales[0]?.languageCode || 'vn';
  }
};

export default i18n;
