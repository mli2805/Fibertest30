import { createAction, props } from '@ngrx/store';
import { MonitoringAlarm } from '../models';
import { ServerError } from '../../models/server-error';

const resetError = createAction('[AllAlarms] Reset Error');

const getAllAlarms = createAction(
  '[AllAlarms] Get AllAlarms',
  props<{ monitoringPortIds: number[] }>()
);

const getAllAlarmsSuccess = createAction(
  '[AllAlarms] Get AllAlarms Success',
  props<{ allAlarms: MonitoringAlarm[] }>()
);

const getAllAlarmsFailure = createAction(
  '[AllAlarms] Get AllAlarms Failure',
  props<{ error: ServerError }>()
);

export const AllAlarmsActions = {
  resetError,
  getAllAlarms,
  getAllAlarmsSuccess,
  getAllAlarmsFailure
};
