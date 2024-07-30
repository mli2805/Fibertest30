import { createReducer, on } from '@ngrx/store';
import { RtuTreeState } from './rtu-tree.state';
import { DeviceActions } from '../device/device.actions';
import { RtuTreeActions } from './rtu-tree.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { Rtu } from '../models/ft30/rtu';

export const RtuTreeStateAdapter = createEntityAdapter<Rtu>({
  selectId: (rtu: Rtu) => rtu.rtuId
});

export const initialState: RtuTreeState = RtuTreeStateAdapter.getInitialState({
  loading: false,
  loaded: false,
  errorMessageId: null
});

const reducer = createReducer(
  initialState,

  on(DeviceActions.loadDeviceInfo, (state) => {
    return RtuTreeStateAdapter.removeAll({
      ...state
    });
  }),
  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo }) => {
    return RtuTreeStateAdapter.setAll(deviceInfo.rtus, {
      ...state
    });
  }),

  on(RtuTreeActions.refreshRtuTree, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),

  on(RtuTreeActions.getOneRtu, (state) => ({
    ...state,
    loaded: false,
    loading: true
  })),
  on(RtuTreeActions.getOneRtuSuccess, (state, { rtu }) => {
    return RtuTreeStateAdapter.updateOne(
      { id: rtu.rtuId, changes: rtu },
      {
        ...state,
        loaded: true,
        loading: false
      }
    );
  }),
  on(RtuTreeActions.getOneRtuFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  }))
);

export function rtuTreeReducer(state: RtuTreeState | undefined, action: any): RtuTreeState {
  return reducer(state, action);
}
