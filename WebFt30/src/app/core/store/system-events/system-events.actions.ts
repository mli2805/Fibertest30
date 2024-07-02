import { createAction, props } from '@ngrx/store';
import { SystemEvent } from '../models';
import { ServerError } from '../../models/server-error';

const getSystemEvents = createAction('[SystemEvents] Get System Events');
const getSystemEventsSuccess = createAction(
  '[SystemEvents] Get System Events Success',
  props<{ systemEvents: SystemEvent[] }>()
);

const getSystemEventsFailure = createAction(
  '[SystemEvents] Get System Events Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[SystemEvents] Reset Error');

export const SystemEventsActions = {
  getSystemEvents,
  getSystemEventsSuccess,
  getSystemEventsFailure,
  resetError
};
