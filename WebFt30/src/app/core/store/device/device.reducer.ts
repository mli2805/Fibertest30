import { createReducer, on } from '@ngrx/store';
import { DeviceState } from './device.state';
import { DeviceActions } from './device.actions';

export const initialState: DeviceState = {
  deviceInfo: null, // null means not loaded yet
  loading: false
};

// loading, global or local?

const reducer = createReducer(
  initialState,
  on(DeviceActions.loadDeviceInfo, (state) => ({
    ...state,
    deviceInfo: null,
    loading: true
  })),

  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo }) => ({
    ...state,
    deviceInfo,
    loading: false
  }))

  // on(DeviceActions.loadDeviceInfoFailure, (state) => ({
  //   ...state
  // }))
);

export function deviceReducer(state: DeviceState | undefined, action: any): DeviceState {
  return reducer(state, action);
}
