import { createReducer, on } from '@ngrx/store';
import { DeviceState } from './device.state';
import { DeviceActions } from './device.actions';

export const initialState: DeviceState = {
  deviceInfo: null, // null means not loaded yet
  hasCurrentEvents: null,
  loading: false
};

// loading, global or local?

const reducer = createReducer(
  initialState,
  on(DeviceActions.loadDeviceInfo, (state) => ({
    ...state,
    deviceInfo: null,
    hasCurrentEvents: null,
    loading: true
  })),

  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo, hasCurrentEvents }) => ({
    ...state,
    deviceInfo,
    hasCurrentEvents,
    loading: false
  })),
  on(DeviceActions.getHasCurrentEvents, (state) => ({
    ...state,
    loading: true
  })),
  on(DeviceActions.getHasCurrentEventsSuccess, (state, { hasCurrentEvents }) => ({
    ...state,
    hasCurrentEvents,
    loading: false
  }))
);

export function deviceReducer(state: DeviceState | undefined, action: any): DeviceState {
  return reducer(state, action);
}
