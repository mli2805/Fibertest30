import { createSelector } from '@ngrx/store';

import { DeviceInfo, DeviceState } from './device.state';
import { selectDeviceState } from '../../core.state';

const selectDevice = createSelector(selectDeviceState, (state: DeviceState) => state);

const selectInfo = createSelector(selectDevice, (state: DeviceState) => state.deviceInfo);

const selectSerialNumber = createSelector(
  selectInfo,
  (info: DeviceInfo | null) => info?.serialNumber ?? null
);

const selectIpV4Address = createSelector(
  selectInfo,
  (info: DeviceInfo | null) => info?.ipV4Address ?? null
);

const selectApiVersion = createSelector(
  selectInfo,
  (info: DeviceInfo | null) => info?.apiVersion ?? null
);

const selectSupportedMeasurementParameters = createSelector(
  selectInfo,
  (info: DeviceInfo | null) => info?.supportedMeasurementParameters || null
);

const selectLoading = createSelector(
  selectDevice,
  (device: DeviceState | null) => device?.loading ?? false
);

export const DeviceSelectors = {
  selectDevice,
  selectInfo,
  selectSerialNumber,
  selectIpV4Address,
  selectApiVersion,
  selectSupportedMeasurementParameters,
  selectLoading
};
