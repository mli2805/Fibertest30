import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { NetworkEvent } from '../models/ft30/network-event';

const getNetworkEvents = createAction(
  '[NetworkEvents] Get Network Events',
  props<{ currentEvents: boolean }>()
);
const getNetworkEventsSuccess = createAction(
  '[NetworkEvents] Get Network Events Success',
  props<{ networkEvents: NetworkEvent[] }>()
);

const getNetworkEventsFailure = createAction(
  '[NetworkEvents] Get Network Events Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[NetworkEvents] Reset Error');

export const NetworkEventsActions = {
  getNetworkEvents,
  getNetworkEventsSuccess,
  getNetworkEventsFailure,
  resetError
};
