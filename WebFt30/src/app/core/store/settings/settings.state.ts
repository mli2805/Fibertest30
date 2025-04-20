import { AppTimezone } from '../models';

export const AppThemes = ['dark', 'light'] as const;
export type AppTheme = (typeof AppThemes)[number];

export const AppLanguages = ['en', 'ru', 'debug'] as const;
export type AppLanguage = (typeof AppLanguages)[number];

export const AppDateTimeFormats = ['short', 'medium', 'long'] as const;
export type AppDateTimeFormat = (typeof AppDateTimeFormats)[number];

export const LatLngFormats = [
  `ddd.dddddd\u00B0`,
  `ddd\u00B0 mm.mmmmm\u2032`,
  `ddd\u00B0 mm\u2032 ss.ss\u2033`
] as const;
export type LatLngFormat = (typeof LatLngFormats)[number];

export const AppDateTimeLanguageFormats = ['en', 'it', 'fr', 'de', 'pl'] as const;
export type AppDateTimeLanguageFormat = (typeof AppDateTimeLanguageFormats)[number];

export interface SettingsState {
  theme: AppTheme;
  timeZone: AppTimezone;
  language: AppLanguage;
  dateTimeFormat: AppDateTimeLanguageFormat;
  latLngFormat: LatLngFormat;
  zoom: number;
  lat: number;
  lng: number;
  showNodesFromZoom: number;
  sourceMapId: number;
  saveUserSettingsError: string | null;
  switchOffSuspicionSignalling: boolean;
  switchOffRtuStatusEventsSignalling: boolean;
}
