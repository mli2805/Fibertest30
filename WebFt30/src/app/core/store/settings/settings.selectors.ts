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
  selectSwitchOffSuspicionSignalling,
  selectSwitchOffRtuStatusEventsSignalling,
  selectTimeZone,
  selectSaveUserSettingsError
};
