import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import cn from './cn.json';

const STORE_LANGUAGE_KEY = "settings.lang";

const resources = {
    en: {
        translation: en,
    },
    cn: {
        translation: cn,
    },
    'zh': {
        translation: cn,  // Map zh to Chinese
    },
    'zh-Hans': {
        translation: cn,  // Map Simplified Chinese
    },
    'zh-Hant': {
        translation: cn,  // Map Traditional Chinese
    },
    my: {
        translation: en, // Placeholder for Malaysian
    },
    id: {
        translation: en, // Placeholder for Indonesian
    },
};

// Helper function to get the best available language
const getDeviceLanguage = () => {
    const deviceLocales = RNLocalize.getLocales();
    
    // Try to find exact match first
    const bestLanguage = RNLocalize.findBestLanguageTag(Object.keys(resources));
    if (bestLanguage) {
        // Map zh variants to cn for our app
        if (bestLanguage.languageTag.startsWith('zh')) {
            return 'cn';
        }
        return bestLanguage.languageTag;
    }
    
    // Check primary (first) language from device locales
    const primaryLocale = deviceLocales[0];
    if (primaryLocale) {
        const langCode = primaryLocale.languageCode;
        if (langCode === 'zh' || langCode.startsWith('zh-')) return 'cn';
        if (langCode === 'ms' || langCode === 'my') return 'my';
        if (langCode === 'id') return 'id';
        if (langCode === 'en' || langCode.startsWith('en-')) return 'en';
    }
    
    // Fallback: check all locales
    for (const locale of deviceLocales) {
        const langCode = locale.languageCode;
        if (langCode === 'zh' || langCode.startsWith('zh-')) return 'cn';
        if (langCode === 'ms' || langCode === 'my') return 'my';
        if (langCode === 'id') return 'id';
        if (langCode === 'en' || langCode.startsWith('en-')) return 'en';
    }
    
    // Final fallback to English
    return 'en';
};

const languageDetectorPlugin = {
    type: "languageDetector",
    async: true,
    init: () => { },
    detect: async function (callback) {
        try {
            const storedLanguage = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
            
            if (storedLanguage) {
                return callback(storedLanguage);
            } else {
                const deviceLanguage = getDeviceLanguage();
                await AsyncStorage.setItem(STORE_LANGUAGE_KEY, deviceLanguage);
                return callback(deviceLanguage);
            }
        } catch (error) {
            return callback("en");
        }
    },
    cacheUserLanguage: async function (language) {
        try {
            await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
        } catch (error) {
            // Silent fail - language will fallback to detection on next app start
        }
    },
};

i18n.use(initReactI18next).use(languageDetectorPlugin).init({
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

// Utility function to reset language to system default
export const resetToSystemLanguage = async () => {
    try {
        await AsyncStorage.removeItem(STORE_LANGUAGE_KEY);
        const systemLanguage = getDeviceLanguage();
        await AsyncStorage.setItem(STORE_LANGUAGE_KEY, systemLanguage);
        i18n.changeLanguage(systemLanguage);
        return systemLanguage;
    } catch (error) {
        return "en";
    }
};

export default i18n;