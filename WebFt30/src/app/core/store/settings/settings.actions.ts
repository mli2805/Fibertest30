import { createAction, props } from '@ngrx/store';

import {
  AppLanguage,
  AppTheme,
  SettingsState,
  AppDateTimeLanguageFormat,
  LatLngFormat
} from './settings.state';
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

const changeLatLngFormat = createAction(
  '[Settings] Change LatLngFormat',
  props<{ latLngFormat: LatLngFormat }>()
);

const changeLatLngFormatNoPersist = createAction(
  '[Settings] Change LatLngFormat No Persist',
  props<{ latLngFormat: LatLngFormat }>()
);

const changeTimeZone = createAction(
  '[Settings] Change Time Zone',
  props<{ timeZone: AppTimezone }>()
);

const changeZoom = createAction('[Settings] Change Zoom', props<{ zoom: number }>());
const changeCenter = createAction('[Settings] Change Center', props<{ center: L.LatLng }>());
const changeShowNodesFromZoom = createAction(
  '[Settings] Change ShowNodesFromZoom',
  props<{ zoom: number }>()
);
const changeSourceMapId = createAction('[Settings] Change SourceMapId', props<{ id: number }>());
const changeSwitchOffSuspicionSignalling = createAction(
  '[Settings] Change SwitchOffSuspicionSignalling',
  props<{ value: boolean }>()
);
const changeSwitchOffRtuStatusEventsSignalling = createAction(
  '[Settings] Change SwitchOffRtuStatusEventsSignalling',
  props<{ value: boolean }>()
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
  changeLatLngFormat,
  changeLatLngFormatNoPersist,
  changeTimeZone,
  changeZoom,
  changeCenter,
  changeShowNodesFromZoom,
  changeSourceMapId,
  changeSwitchOffSuspicionSignalling,
  changeSwitchOffRtuStatusEventsSignalling,

  saveUserSettings,
  saveUserSettingsSuccess,
  saveUserSettingsFailure
};
