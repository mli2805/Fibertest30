import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { BopEvent } from '../models/ft30/bop-event';

const getBopEvents = createAction(
  '[BopEvents] Get Bop Events',
  props<{ currentEvents: boolean }>()
);
const getBopEventsSuccess = createAction(
  '[BopEvents] Get Bop Events Success',
  props<{ bopEvents: BopEvent[] }>()
);

const getBopEventsFailure = createAction(
  '[BopEvents] Get Bop Events Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[BopEvents] Reset Error');

export const BopEventsActions = {
  getBopEvents,
  getBopEventsSuccess,
  getBopEventsFailure,
  resetError
};
