import { createReducer, on } from '@ngrx/store';
import { NetworkSettingsState } from './network-settings.state';
import { NetworkSettingsActions } from './network-settings.action';
import { DeviceActions } from '../device/device.actions';

export const initialState: NetworkSettingsState = {
  networkSettings: null,
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
    networkSettings: deviceInfo.networkSettings
  })),

  on(NetworkSettingsActions.updateNetworkSettings, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(NetworkSettingsActions.updateNetworkSettingsFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(NetworkSettingsActions.refreshNetworkSettings, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(NetworkSettingsActions.refreshNetworkSettingsSuccess, (state, { settings }) => ({
    ...state,
    networkSettings: settings,
    loading: false,
    loaded: true,
    errorMessageId: null
  })),
  on(NetworkSettingsActions.refreshNetworkSettingsFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  }))
);

export function networkSettingsReducer(
  state: NetworkSettingsState | undefined,
  action: any
): NetworkSettingsState {
  return reducer(state, action);
}
