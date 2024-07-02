import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { MonitoringAlarmEvent } from '../models';

const resetError = createAction('[AlarmEvents] Reset Error');

const getAlarmEvents = createAction(
  '[AlarmEvents] Get Alarm Events',
  props<{ monitoringPortIds: number[] }>()
);
const getAlarmEventsSuccess = createAction(
  '[AlarmEvents] Get Alarm Events Success',
  props<{ alarmEvents: MonitoringAlarmEvent[] }>()
);
const getAlarmEventsFailure = createAction(
  '[AlarmEvents] Get Alarm Events Failure',
  props<{ error: ServerError }>()
);

export const AlarmEventsActions = {
  resetError,
  getAlarmEvents,
  getAlarmEventsSuccess,
  getAlarmEventsFailure
};
