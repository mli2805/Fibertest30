import { createReducer, on } from '@ngrx/store';
import { TimeSettingsState } from './time-settings.state';
import { DeviceActions } from '../device/device.actions';
import { TimeSettingsActions } from './time-settings.action';

export const initialState: TimeSettingsState = {
  timeSettings: null,
  loading: false,
  loaded: false,
  errorMessageId: null
};

const reducer = createReducer(
  initialState,

  on(DeviceActions.loadDeviceInfo, (state) => ({
    ...state,
    loaded: false,
    loading: true
  })),

  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo }) => ({
    ...state,
    loaded: true,
    loading: false,
    timeSettings: deviceInfo.timeSettings
  })),

  on(TimeSettingsActions.updateTimeSettings, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(TimeSettingsActions.updateTimeSettingsFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(TimeSettingsActions.refreshTimeSettings, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(TimeSettingsActions.refreshTimeSettingsSuccess, (state, { settings }) => ({
    ...state,
    timeSettings: settings,
    loading: false,
    loaded: true,
    errorMessageId: null
  })),
  on(TimeSettingsActions.refreshTimeSettingsFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  }))
);

export function timeSettingsReducer(
  state: TimeSettingsState | undefined,
  action: any
): TimeSettingsState {
  return reducer(state, action);
}
