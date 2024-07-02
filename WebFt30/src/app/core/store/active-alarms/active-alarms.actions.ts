import { createAction, props } from '@ngrx/store';
import { MonitoringAlarm } from '../models';
import { ServerError } from '../../models/server-error';

// const getActiveAlarms = createAction('[ActiveAlarms] Get ActiveAlarms');

// const getActiveAlarmsSuccess = createAction(
//   '[ActiveAlarms] Get ActiveAlarms Success',
//   props<{ activeAlarms: MonitoringAlarm[] }>()
// );

// const getActiveAlarmsFailure = createAction(
//   '[ActiveAlarms] Get ActiveAlarms Failure',
//   props<{ error: ServerError }>()
// );

const addOrUpdateAlarm = createAction(
  '[ActiveAlarms] Add or Update Alarm',
  props<{ id: number }>()
);

const addOrUpdateAlarmSuccess = createAction(
  '[ActiveAlarms] Add or Update Alarm Success',
  props<{ alarm: MonitoringAlarm }>()
);

const addOrUpdateAlarmFailure = createAction(
  '[ActiveAlarms] Add or Update Alarm Failure',
  props<{ error: ServerError }>()
);

export const ActiveAlarmsActions = {
  // getActiveAlarms,
  // getActiveAlarmsSuccess,
  // getActiveAlarmsFailure,
  addOrUpdateAlarm,
  addOrUpdateAlarmSuccess,
  addOrUpdateAlarmFailure
};
