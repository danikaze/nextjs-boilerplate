import NextI18Next from 'next-i18next';
import { Lang } from '@store/model/metadata';

const i18next = new NextI18Next({
  lng: 'en',
  defaultLanguage: 'en',
  fallbackLng: 'en',
  otherLanguages: ['en', 'es'],
  localePath: IS_SERVER ? LOCALES_PATH : LOCALES_URL,
});

export const appWithTranslation = i18next.appWithTranslation.bind(i18next);
export const useTranslation = i18next.useTranslation.bind(i18next);
export const changeLang = i18next.i18n.changeLanguage.bind(i18next.i18n);
export const getCurrentLang = () => i18next.i18n.language;
export const availableLangs = () => ['en', 'es'] as Lang[];
