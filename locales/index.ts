import { createI18n } from 'next-international'
import {TLocale} from "@/utils/types";

export interface I18nFunctions {
  useI18n: () => ((n: string, v?: any) => string),
  useScopedI18n: (scope: string) => ((n: string, v?: any) => string),
  I18nProvider: React.ComponentType;
  useChangeLocale: () => ((l: TLocale) => void);
  useCurrentLocale: () => TLocale;
}

export const {
  useI18n,
  useScopedI18n,
  I18nProvider,
  useChangeLocale,
  useCurrentLocale
} = createI18n({
  en: () => import('./en'),
  uk: () => import('./uk'),
  ru: () => import('./ru')
}) as I18nFunctions;

