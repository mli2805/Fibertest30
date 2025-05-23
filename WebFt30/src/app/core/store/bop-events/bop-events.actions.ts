import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { BopEvent } from '../models/ft30/bop-event';
import { DateTimeRange } from 'src/grpc-generated/events.data';

const getBopEvents = createAction(
  '[BopEvents] Get Bop Events',
  props<{ currentEvents: boolean; orderDescending: boolean; searchWindow: DateTimeRange | null }>()
);
const getBopEventsSuccess = createAction(
  '[BopEvents] Get Bop Events Success',
  props<{ bopEvents: BopEvent[] }>()
);

const getBopEventsFailure = createAction(
  '[BopEvents] Get Bop Events Failure',
  props<{ error: ServerError }>()
);

const loadNextBopEvents = createAction(
  '[BopEvents] LoadNext Bop Events',
  props<{
    currentEvents: boolean;
    orderDescending: boolean;
    lastLoaded: Date;
    searchWindow: DateTimeRange | null;
  }>()
);
const loadNextBopEventsSuccess = createAction(
  '[BopEvents] LoadNext Bop Events Success',
  props<{ bopEvents: BopEvent[] }>()
);

const loadNextBopEventsFailure = createAction(
  '[BopEvents] LoadNext Bop Events Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[BopEvents] Reset Error');

export const BopEventsActions = {
  getBopEvents,
  getBopEventsSuccess,
  getBopEventsFailure,

  loadNextBopEvents,
  loadNextBopEventsSuccess,
  loadNextBopEventsFailure,
  resetError
};
