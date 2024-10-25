import { createSelector } from '@ngrx/store';

import { DeviceInfo, DeviceState } from './device.state';
import { selectDeviceState } from '../../core.state';

const selectDevice = createSelector(selectDeviceState, (state: DeviceState) => state);

const selectInfo = createSelector(selectDevice, (state: DeviceState) => state.deviceInfo);

const selectApiVersion = createSelector(
  selectInfo,
  (info: DeviceInfo | null) => info?.apiVersion ?? null
);

const selectLoading = createSelector(
  selectDevice,
  (device: DeviceState | null) => device?.loading ?? false
);

const selectHasCurrent = createSelector(
  selectDevice,
  (device: DeviceState | null) => device?.hasCurrentEvents ?? null
);

export const DeviceSelectors = {
  selectDevice,
  selectInfo,
  selectApiVersion,
  selectLoading,

  selectHasCurrent
};
