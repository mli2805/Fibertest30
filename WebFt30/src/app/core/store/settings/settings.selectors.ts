import { createSelector } from '@ngrx/store';

import { selectSettingsState } from '../../core.state';
import { SettingsState } from './settings.state';

const selectSettings = createSelector(selectSettingsState, (state: SettingsState) => state);

const selectTheme = createSelector(selectSettings, (state: SettingsState) => state.theme);

const selectLanguage = createSelector(selectSettings, (state: SettingsState) => state.language);

const selectDateTimeFormat = createSelector(
  selectSettings,
  (state: SettingsState) => state.dateTimeFormat
);

const selectLatLngFormat = createSelector(
  selectSettings,
  (state: SettingsState) => state.latLngFormat
);

const selectLanLngFormatName = createSelector(selectSettings, (state: SettingsState) => {
  switch (state.latLngFormat) {
    case 'ddd.dddddd\u00B0':
      return 'degrees';
    case 'ddd\u00B0 mm.mmmmm\u2032':
      return 'minutes';
    case 'ddd\u00B0 mm\u2032 ss.ss\u2033':
      return 'seconds';
  }
});

const selectSwitchOffSuspicionSignalling = createSelector(
  selectSettings,
  (state: SettingsState) => state.switchOffSuspicionSignalling
);
const selectSwitchOffRtuStatusEventsSignalling = createSelector(
  selectSettings,
  (state: SettingsState) => state.switchOffRtuStatusEventsSignalling
);

const selectTimeZone = createSelector(selectSettings, (state: SettingsState) => {
  return { dateTimeFormat: state.dateTimeFormat, timeZone: state.timeZone };
});

const selectSaveUserSettingsError = createSelector(
  selectSettings,
  (state: SettingsState) => state.saveUserSettingsError
);

export const SettingsSelectors = {
  selectSettings,
  selectTheme,
  selectLanguage,
  selectDateTimeFormat,
  selectLatLngFormat,
  selectLanLngFormatName,
  selectSwitchOffSuspicionSignalling,
  selectSwitchOffRtuStatusEventsSignalling,
  selectTimeZone,
  selectSaveUserSettingsError
};
