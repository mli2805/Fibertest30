import { createSelector } from '@ngrx/store';
import { selectTimeSettingsState } from '../../core.state';
import { TimeSettingsState } from './time-settings.state';

const selectTimeSettings = createSelector(
  selectTimeSettingsState,
  (state: TimeSettingsState) => state.timeSettings
);

const selectLoading = createSelector(
  selectTimeSettingsState,
  (state: TimeSettingsState) => state.loading
);

const selectErrorMessageId = createSelector(
  selectTimeSettingsState,
  (state: TimeSettingsState) => state.errorMessageId
);

const selectTimeZone = createSelector(
  selectTimeSettingsState,
  (timeSettingsState: TimeSettingsState) => timeSettingsState.timeSettings!.timeZone
);

export const TimeSettingsSelectors = {
  selectTimeSettings,
  selectLoading,
  selectErrorMessageId,
  selectTimeZone
};
