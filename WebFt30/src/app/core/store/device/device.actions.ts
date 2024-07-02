import { createAction, props } from '@ngrx/store';
import { DeviceInfo } from './device.state';

const loadDeviceInfo = createAction('[Device] Load Device Info');

const loadDeviceInfoSuccess = createAction(
  '[Device] Load Device Info Success',
  props<{ deviceInfo: DeviceInfo }>()
);

const loadDeviceInfoFailure = createAction(
  '[Device] Load Device Info Failure',
  props<{ error: string }>()
);

export const DeviceActions = {
  loadDeviceInfo,
  loadDeviceInfoSuccess,
  loadDeviceInfoFailure
};
