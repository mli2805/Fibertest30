import { Action, createReducer, on } from '@ngrx/store';

import {
  AppDateTimeFormat,
  AppDateTimeLanguageFormat,
  AppLanguage,
  AppTheme,
  SettingsState
} from './settings.state';
import { SettingsActions } from './settings.actions';
import { AuthActions } from '../../auth/auth.actions';

export const initialState: SettingsState = {
  theme: 'light', // the very first theme is based on 'prefers-color-scheme' media query (see loadInitialSettingsState)
  language: 'en', // user navigator's language will be used if supported (see loadInitialSettingsState)
  dateTimeFormat: 'en',
  saveUserSettingsError: null
};

const reducer = createReducer(
  initialState,
  on(SettingsActions.changeTheme, (state, { theme }) => ({ ...state, theme })),
  on(SettingsActions.changeLanguage, (state, { language }) => ({ ...state, language })),
  on(SettingsActions.changeDateTimeFormat, (state, { dateTimeFormat }) => ({
    ...state,
    dateTimeFormat
  })),
  on(AuthActions.loginSuccess, (state, { settings }) => {
    if (settings == null) {
      return state;
    }

    return {
      ...state,
      theme: <AppTheme>settings.theme,
      language: <AppLanguage>settings.language,
      dateTimeFormat: <AppDateTimeLanguageFormat>settings.dateTimeFormat
    };
  }),
  on(AuthActions.loadCurrentUserSuccess, (state, { settings }) => {
    if (settings == null) {
      return state;
    }

    return {
      ...state,
      theme: <AppTheme>settings.theme,
      language: <AppLanguage>settings.language,
      dateTimeFormat: <AppDateTimeLanguageFormat>settings.dateTimeFormat
    };
  }),
  on(SettingsActions.saveUserSettings, (state) => ({
    ...state,
    saveUserSettingsError: null
  })),
  on(SettingsActions.saveUserSettingsFailure, (state, { error }) => ({
    ...state,
    saveUserSettingsError: error
  }))
);

export function settingsReducer(state: SettingsState | undefined, action: Action): SettingsState {
  return reducer(state, action);
}
