import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { NetworkEvent } from '../models/ft30/network-event';
import { DateTimeRange } from 'src/grpc-generated/events.data';

const getNetworkEvents = createAction(
  '[NetworkEvents] Get Network Events',
  props<{ currentEvents: boolean; orderDescending: boolean; searchWindow: DateTimeRange | null }>()
);
const getNetworkEventsSuccess = createAction(
  '[NetworkEvents] Get Network Events Success',
  props<{ networkEvents: NetworkEvent[] }>()
);

const getNetworkEventsFailure = createAction(
  '[NetworkEvents] Get Network Events Failure',
  props<{ error: ServerError }>()
);

const loadNextNetworkEvents = createAction(
  '[NetworkEvents] LoadNext Network Events',
  props<{
    currentEvents: boolean;
    orderDescending: boolean;
    lastLoaded: Date;
    searchWindow: DateTimeRange | null;
  }>()
);
const loadNextNetworkEventsSuccess = createAction(
  '[NetworkEvents] LoadNext Network Events Success',
  props<{ networkEvents: NetworkEvent[] }>()
);

const loadNextNetworkEventsFailure = createAction(
  '[NetworkEvents] LoadNext Network Events Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[NetworkEvents] Reset Error');

export const NetworkEventsActions = {
  getNetworkEvents,
  getNetworkEventsSuccess,
  getNetworkEventsFailure,

  loadNextNetworkEvents,
  loadNextNetworkEventsSuccess,
  loadNextNetworkEventsFailure,
  resetError
};
