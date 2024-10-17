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

const selectHasCurrentOpticalEvents = createSelector(
  selectDevice,
  (device: DeviceState | null) =>
    device?.deviceInfo?.hasCurrentEvents.hasCurrentOpticalEvents ?? false
);
const selectHasCurrentNetworkEvents = createSelector(
  selectDevice,
  (device: DeviceState | null) =>
    device?.deviceInfo?.hasCurrentEvents.hasCurrentNetworkEvents ?? false
);
const selectHasCurrentBopNetworkEvents = createSelector(
  selectDevice,
  (device: DeviceState | null) =>
    device?.deviceInfo?.hasCurrentEvents.hasCurrentBopNetworkEvents ?? false
);
const selectHasCurrentRtuAccidents = createSelector(
  selectDevice,
  (device: DeviceState | null) =>
    device?.deviceInfo?.hasCurrentEvents.hasCurrentRtuAccidents ?? false
);

export const DeviceSelectors = {
  selectDevice,
  selectInfo,
  selectApiVersion,
  selectLoading,

  selectHasCurrentOpticalEvents,
  selectHasCurrentNetworkEvents,
  selectHasCurrentBopNetworkEvents,
  selectHasCurrentRtuAccidents
};
