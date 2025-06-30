import { Action, createReducer, on } from '@ngrx/store';

import {
  AppDateTimeFormat,
  AppDateTimeLanguageFormat,
  AppLanguage,
  AppTheme,
  LatLngFormat,
  SettingsState
} from './settings.state';
import { SettingsActions } from './settings.actions';
import { AuthActions } from '../../auth/auth.actions';
import { AppTimezone } from '../models';

export const initialState: SettingsState = {
  theme: 'light', // the very first theme is based on 'prefers-color-scheme' media query (see loadInitialSettingsState)
  language: 'en', // user navigator's language will be used if supported (see loadInitialSettingsState)
  dateTimeFormat: 'en',
  latLngFormat: `ddd.dddddd\u00B0`,
  timeZone: AppTimezone.GetUtcTimeZone(), // т.е. показываем время как оно есть на сервере, возможно когда-нибудь будем хранить на сервере в UTC, тогда надо будет здесь реальная зона
  zoom: 16,
  lat: 53.88,
  lng: 27.51,
  showNodesFromZoom: 16,
  sourceMapId: 1,
  saveUserSettingsError: null,
  switchOffSuspicionSignalling: false,
  switchOffRtuStatusEventsSignalling: false
};

const reducer = createReducer(
  initialState,
  on(SettingsActions.changeTheme, (state, { theme }) => ({ ...state, theme })),
  on(SettingsActions.changeLanguage, (state, { language }) => ({ ...state, language })),
  on(SettingsActions.changeDateTimeFormat, (state, { dateTimeFormat }) => ({
    ...state,
    dateTimeFormat
  })),
  on(SettingsActions.changeLatLngFormat, (state, { latLngFormat }) => ({
    ...state,
    latLngFormat
  })),
  on(SettingsActions.changeLatLngFormatNoPersist, (state, { latLngFormat }) => ({
    ...state,
    latLngFormat
  })),
  on(SettingsActions.changeSwitchOffSuspicionSignalling, (state, { value }) => ({
    ...state,
    switchOffSuspicionSignalling: value
  })),
  on(SettingsActions.changeSwitchOffRtuStatusEventsSignalling, (state, { value }) => ({
    ...state,
    switchOffRtuStatusEventsSignalling: value
  })),
  on(SettingsActions.changeZoom, (state, { zoom }) => ({ ...state, zoom })),
  on(SettingsActions.changeShowNodesFromZoom, (state, { zoom }) => ({
    ...state,
    showNodesFromZoom: zoom
  })),
  on(SettingsActions.changeSourceMapId, (state, { id }) => ({
    ...state,
    sourceMapId: id
  })),
  on(SettingsActions.changeCenter, (state, { center }) => ({
    ...state,
    lat: center.lat,
    lng: center.lng
  })),
  on(AuthActions.loginSuccess, (state, { settings }) => {
    if (settings == null) {
      return state;
    }

    return {
      ...state,
      theme: <AppTheme>settings.theme,
      language: <AppLanguage>settings.language,
      dateTimeFormat: <AppDateTimeLanguageFormat>settings.dateTimeFormat,
      latLngFormat: <LatLngFormat>settings.latLngFormat,
      zoom: settings.zoom,
      lat: settings.lat,
      lng: settings.lng,
      showNodesFromZoom: settings.showNodesFromZoom,
      sourceMapId: settings.sourceMapId,
      switchOffSuspicionSignalling: settings.switchOffSuspicionSignalling,
      switchOffRtuStatusEventsSignalling: settings.switchOffRtuStatusEventsSignalling
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
      dateTimeFormat: <AppDateTimeLanguageFormat>settings.dateTimeFormat,
      latLngFormat: <LatLngFormat>settings.latLngFormat,
      zoom: settings.zoom,
      lat: settings.lat,
      lng: settings.lng,
      showNodesFromZoom: settings.showNodesFromZoom,
      sourceMapId: settings.sourceMapId,
      switchOffSuspicionSignalling: settings.switchOffSuspicionSignalling,
      switchOffRtuStatusEventsSignalling: settings.switchOffRtuStatusEventsSignalling
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
