import { createAction, props } from '@ngrx/store';
import { TimeSettings } from '../models/time-settings';

const refreshTimeSettings = createAction('[TimeSettings] Refresh Time Settings');

const refreshTimeSettingsSuccess = createAction(
  '[TimeSettings] Refresh Time Settings Success',
  props<{ settings: TimeSettings }>()
);

const refreshTimeSettingsFailure = createAction(
  '[TimeSettings] Refresh Time Settings Failure',
  props<{ errorMessageId: string }>()
);

const updateTimeSettings = createAction(
  '[TimeSettings] Update Time Settings',
  props<{ settings: TimeSettings }>()
);

const updateTimeSettingsSuccess = createAction('[TimeSettings] Update Time Settings Success');

const updateTimeSettingsFailure = createAction(
  '[TimeSettings] Update Time Settings Failure',
  props<{ errorMessageId: string }>()
);

export const TimeSettingsActions = {
  refreshTimeSettings,
  refreshTimeSettingsSuccess,
  refreshTimeSettingsFailure,

  updateTimeSettings,
  updateTimeSettingsSuccess,
  updateTimeSettingsFailure
};
