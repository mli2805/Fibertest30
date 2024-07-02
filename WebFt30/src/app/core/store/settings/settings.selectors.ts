import { createSelector } from '@ngrx/store';

import { selectSettingsState } from '../../core.state';
import { SettingsState } from './settings.state';
import { AppTimezone } from '../models';
import { TimeSettingsSelectors } from '../time-settings/time-settings.selectors';

const selectSettings = createSelector(selectSettingsState, (state: SettingsState) => state);

const selectTheme = createSelector(selectSettings, (state: SettingsState) => state.theme);

const selectLanguage = createSelector(selectSettings, (state: SettingsState) => state.language);

const selectDateTimeFormat = createSelector(
  selectSettings,
  (state: SettingsState) => state.dateTimeFormat
);

const selectDateTimeFormatAndTimeZone = createSelector(
  selectSettings,
  TimeSettingsSelectors.selectTimeZone,
  (state: SettingsState, timezone: AppTimezone) => {
    return {
      dateTimeFormat: state.dateTimeFormat,
      timezone
    };
  }
);

const selectSaveUserSettingsError = createSelector(
  selectSettings,
  (state: SettingsState) => state.saveUserSettingsError
);

export const SettingsSelectors = {
  selectSettings,
  selectTheme,
  selectLanguage,
  selectDateTimeFormat,
  selectSaveUserSettingsError,
  selectDateTimeFormatAndTimeZone
};
