import { createSelector } from '@ngrx/store';
import { selectNetworkEventsState } from '../../core.state';
import { NetworkEventsState } from './network-events.state';
import { NetworkEvent } from '../models/ft30/network-event';

const selectNetworkEvents = createSelector(
  selectNetworkEventsState,
  (state: NetworkEventsState) => state.networkEvents
);

const selectLoading = createSelector(
  selectNetworkEventsState,
  (state: NetworkEventsState) => state.loading
);

const selectLoadedTime = createSelector(
  selectNetworkEventsState,
  (state: NetworkEventsState) => state.loadedTime
);

const selectErrorMessageId = createSelector(
  selectNetworkEventsState,
  (state: NetworkEventsState) => {
    if (state.error === null) {
      return null;
    }

    return 'i18n.ft.cant-load-network-events';
  }
);

const selectNetworkEventById = (eventId: number) =>
  createSelector(selectNetworkEvents, (opEvents: NetworkEvent[] | null) => {
    return opEvents?.find((o) => o.eventId === eventId) || null;
  });

export const NetworkEventsSelectors = {
  selectNetworkEvents,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId,

  selectNetworkEventById
};
