export const AppThemes = ['dark', 'light'] as const;
export type AppTheme = (typeof AppThemes)[number];

export const AppLanguages = ['en', 'ja', 'de', 'fr', 'it', 'pl', 'debug'] as const;
export type AppLanguage = (typeof AppLanguages)[number];

export const AppDateTimeFormats = ['short', 'medium', 'long'] as const;
export type AppDateTimeFormat = (typeof AppDateTimeFormats)[number];

export const AppDateTimeLanguageFormats = ['en', 'it', 'fr', 'de', 'pl'] as const;
export type AppDateTimeLanguageFormat = (typeof AppDateTimeLanguageFormats)[number];

export interface SettingsState {
  theme: AppTheme;
  language: AppLanguage;
  dateTimeFormat: AppDateTimeLanguageFormat;
  saveUserSettingsError: string | null;
}
