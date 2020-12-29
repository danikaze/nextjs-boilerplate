import { useContext } from 'react';
import NextI18Next, { I18nContext } from 'next-i18next';

const AVAILABLE_LANGS = AVAILABLE_LANGUAGES;
const i18next = new NextI18Next({
  defaultLanguage: 'en',
  fallbackLng: 'en',
  otherLanguages: AVAILABLE_LANGS,
  localePath: IS_SERVER ? LOCALES_PATH : LOCALES_URL,
  detection: {
    lookupCookie: 'i18nlang',
  },
});

export type Lang = AVAILABLE_LANGUAGE_TYPE;

/**
 * Wrap the Next App to provide a store
 */
export const appWithTranslation = i18next.appWithTranslation.bind(i18next);

/**
 * Hook to get the translation function `t`
 */
export const useTranslation = i18next.useTranslation.bind(i18next);

/**
 * Trigger a language change (load + set).
 * Do not use directly, but use a redux action for it
 */
export const changeLang = i18next.i18n.changeLanguage.bind(i18next.i18n);

/**
 * Get the current language
 * Use as a hook (always in the same order, etc.)
 */
export const getCurrentLanguage = () => {
  const {
    i18n: { language },
  } = useContext(I18nContext);
  return language as Lang;
};

/**
 * List of available languages
 */
export const availableLangs = () => AVAILABLE_LANGS as Lang[];
