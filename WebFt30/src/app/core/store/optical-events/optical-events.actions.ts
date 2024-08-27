import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { OpticalEvent } from '../models/ft30/optical-event';

const getOpticalEvents = createAction(
  '[OpticalEvents] Get Optical Events',
  props<{ currentEvents: boolean }>()
);
const getOpticalEventsSuccess = createAction(
  '[OpticalEvents] Get Optical Events Success',
  props<{ opticalEvents: OpticalEvent[] }>()
);

const getOpticalEventsFailure = createAction(
  '[OpticalEvents] Get Optical Events Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[OpticalEvents] Reset Error');

export const OpticalEventsActions = {
  getOpticalEvents,
  getOpticalEventsSuccess,
  getOpticalEventsFailure,
  resetError
};
