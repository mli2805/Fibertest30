import { createReducer, on } from '@ngrx/store';
import { RtuTreeState } from './rtu-tree.state';
import { DeviceActions } from '../device/device.actions';
import { RtuTreeActions } from './rtu-tree.actions';

export const initialState: RtuTreeState = {
  rtuTree: null,
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
    rtuTree: deviceInfo.rtus
  })),

  on(RtuTreeActions.refreshRtuTree, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  }))
);

export function rtuTreeReducer(state: RtuTreeState | undefined, action: any): RtuTreeState {
  return reducer(state, action);
}
