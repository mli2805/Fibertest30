import { createAction, props } from '@ngrx/store';
import { DeviceInfo } from './device.state';
import { HasCurrentEvents } from '../models/ft30/has-current-events';

const loadDeviceInfo = createAction('[Device] Load Device Info');

const loadDeviceInfoSuccess = createAction(
  '[Device] Load Device Info Success',
  props<{ deviceInfo: DeviceInfo; hasCurrentEvents: HasCurrentEvents }>()
);

const loadDeviceInfoFailure = createAction(
  '[Device] Load Device Info Failure',
  props<{ error: string }>()
);

const getHasCurrentEvents = createAction('[Device] Get Has Current Events');
const getHasCurrentEventsSuccess = createAction(
  '[Device] Get Has Current Events Success',
  props<{ hasCurrentEvents: HasCurrentEvents }>()
);
const getHasCurrentEventsFailure = createAction(
  '[Device] Get Has Current Events Failure',
  props<{ error: string }>()
);

export const DeviceActions = {
  loadDeviceInfo,
  loadDeviceInfoSuccess,
  loadDeviceInfoFailure,

  getHasCurrentEvents,
  getHasCurrentEventsSuccess,
  getHasCurrentEventsFailure
};
