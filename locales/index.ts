import { createI18n } from 'next-international';
import type { Scopes, BaseLocale } from 'international-types';

export type Scope = Scopes<BaseLocale>;

export const { useI18n, useScopedI18n, I18nProvider, useChangeLocale, defineLocale, getLocaleProps, useCurrentLocale } =
  createI18n({
    en: () => import('./en'),
    uk: () => import('./uk'),
    ru: () => import('./ru')
  });
