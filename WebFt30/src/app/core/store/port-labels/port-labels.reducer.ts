import { createEntityAdapter } from '@ngrx/entity';
import { PortLabelsState } from './port-labels.state';
import { createReducer, on } from '@ngrx/store';

import { PortLabel } from '../models';
import { DeviceActions } from '../device/device.actions';

export const PortLabelsStateAdapter = createEntityAdapter<PortLabel>({
  selectId: (portLabel: PortLabel) => portLabel.id,
  sortComparer: (a: PortLabel, b: PortLabel) => a.name.localeCompare(b.name)
});

export const initialState: PortLabelsState = PortLabelsStateAdapter.getInitialState({});

const reducer = createReducer(
  initialState,
  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo }) => {
    return PortLabelsStateAdapter.addMany(deviceInfo.portLabels, {
      ...state
    });
  })
);

export function portLabelsReducer(
  state: PortLabelsState | undefined,
  action: any
): PortLabelsState {
  return reducer(state, action);
}
