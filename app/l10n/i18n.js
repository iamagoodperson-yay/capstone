import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import cn from './cn.json';
import my from './my.json';
import id from './id.json';

const STORE_LANGUAGE_KEY = 'settings.lang';

const resources = {
  en: { translation: en },
  cn: { translation: cn },
  zh: { translation: cn }, // alias for zh
  my: { translation: my },
  id: { translation: id },
};

// Helper function to get the best available language
const getDeviceLanguage = () => {
  const deviceLocales = RNLocalize.getLocales();
  const bestLanguage = RNLocalize.findBestLanguageTag(Object.keys(resources));

  if (bestLanguage) {
    const tag = bestLanguage.languageTag;
    if (tag.startsWith('zh')) return 'cn';
    if (tag.startsWith('ms')) return 'my';
    if (tag.startsWith('id')) return 'id';
    if (tag.startsWith('en')) return 'en';
  }

  const primary = deviceLocales[0];
  if (primary) {
    const code = primary.languageCode;
    if (code.startsWith('zh')) return 'cn';
    if (code === 'ms' || code === 'my') return 'my';
    if (code === 'id') return 'id';
    if (code.startsWith('en')) return 'en';
  }

  return 'en';
};

const languageDetectorPlugin = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async callback => {
    try {
      const stored = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (stored) return callback(stored);

      const detected = getDeviceLanguage();
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, detected);
      return callback(detected);
    } catch {
      return callback('en');
    }
  },
  cacheUserLanguage: async language => {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch {}
  },
};

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export const resetToSystemLanguage = async () => {
  try {
    await AsyncStorage.removeItem(STORE_LANGUAGE_KEY);
    const systemLang = getDeviceLanguage();
    await AsyncStorage.setItem(STORE_LANGUAGE_KEY, systemLang);
    i18n.changeLanguage(systemLang);
    return systemLang;
  } catch {
    return 'en';
  }
};

export default i18n;
