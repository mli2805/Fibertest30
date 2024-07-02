import { createAction, props } from '@ngrx/store';

import { AppLanguage, AppTheme, SettingsState, AppDateTimeLanguageFormat } from './settings.state';

const changeTheme = createAction('[Settings] Change Theme', props<{ theme: AppTheme }>());

const changeLanguage = createAction(
  '[Settings] Change Language',
  props<{ language: AppLanguage }>()
);

const changeDateTimeFormat = createAction(
  '[Settings] Change Date Time Format',
  props<{ dateTimeFormat: AppDateTimeLanguageFormat }>()
);

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
  saveUserSettings,
  saveUserSettingsSuccess,
  saveUserSettingsFailure
};
