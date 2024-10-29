import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { OpticalEvent } from '../models/ft30/optical-event';
import { DateTimeRange } from 'src/grpc-generated/events.data';

const getOpticalEvents = createAction(
  '[OpticalEvents] Get Optical Events',
  props<{ currentEvents: boolean; orderDescending: boolean; searchWindow: DateTimeRange | null }>()
);
const getOpticalEventsSuccess = createAction(
  '[OpticalEvents] Get Optical Events Success',
  props<{ opticalEvents: OpticalEvent[] }>()
);

const getOpticalEventsFailure = createAction(
  '[OpticalEvents] Get Optical Events Failure',
  props<{ error: ServerError }>()
);

const loadNextOpticalEvents = createAction(
  '[OpticalEvents] LoadNext OpticalEvents',
  props<{
    currentEvents: boolean;
    orderDescending: boolean;
    lastLoaded: Date;
    searchWindow: DateTimeRange | null;
  }>()
);
const loadNextOpticalEventsSuccess = createAction(
  '[OpticalEvents] LoadNext OpticalEvents Success',
  props<{ opticalEvents: OpticalEvent[] }>()
);

const loadNextOpticalEventsFailure = createAction(
  '[OpticalEvents] LoadNext OpticalEvents Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[OpticalEvents] Reset Error');

export const OpticalEventsActions = {
  getOpticalEvents,
  getOpticalEventsSuccess,
  getOpticalEventsFailure,

  loadNextOpticalEvents,
  loadNextOpticalEventsSuccess,
  loadNextOpticalEventsFailure,

  resetError
};
