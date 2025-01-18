import { createAction, props } from '@ngrx/store';

import { AppLanguage, AppTheme, SettingsState, AppDateTimeLanguageFormat } from './settings.state';
import { AppTimezone } from '../models';

const changeTheme = createAction('[Settings] Change Theme', props<{ theme: AppTheme }>());

const changeLanguage = createAction(
  '[Settings] Change Language',
  props<{ language: AppLanguage }>()
);

const changeDateTimeFormat = createAction(
  '[Settings] Change Date Time Format',
  props<{ dateTimeFormat: AppDateTimeLanguageFormat }>()
);

const changeTimeZone = createAction(
  '[Settings] Change Time Zone',
  props<{ timeZone: AppTimezone }>()
);

const changeZoom = createAction('[Settings] Change Zoom', props<{ zoom: number }>());
const changeCenter = createAction('[Settings] Change Center', props<{ center: L.LatLng }>());

const saveUserSettings = createAction(
  '[Settings] Save User Settings',
  props<{ settings: SettingsState }>()
);

const saveUserSettingsSuccess = createAction('[Settings] Save User Settings Success');

const saveUserSettingsFailure = createAction(
  '[Settings] Save User Settings Failure',
  props<{ error: string }>()
);

export const SettingsActions = {
  changeTheme,
  changeLanguage,
  changeDateTimeFormat,
  changeTimeZone,
  changeZoom,
  changeCenter,

  saveUserSettings,
  saveUserSettingsSuccess,
  saveUserSettingsFailure
};
