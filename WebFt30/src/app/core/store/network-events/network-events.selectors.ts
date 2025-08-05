import { createSelector } from '@ngrx/store';
import { selectNetworkEventsState } from '../../core.state';
import { NetworkEventsState } from './network-events.state';
import { NetworkEvent } from '../models/ft30/network-event';
import { NetworkEventsStateAdapter } from './network-events.reducer';

const { selectAll, selectEntities, selectTotal } = NetworkEventsStateAdapter.getSelectors();

const selectNetworkEvents = createSelector(selectNetworkEventsState, selectAll);

const selectLoading = createSelector(
  selectNetworkEventsState,
  (state: NetworkEventsState) => state.loading
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
  createSelector(selectNetworkEvents, (networkEvents: NetworkEvent[] | null) => {
    return networkEvents?.find((n) => n.eventId === eventId) || null;
  });

export const selectSortedNetworkEvents = createSelector(
  selectNetworkEvents,
  (events): NetworkEvent[] =>
    events
      .slice() // создаём копию массива, чтобы не мутировать оригинал
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
);

export const NetworkEventsSelectors = {
  // selectNetworkEvents,
  selectLoading,
  selectErrorMessageId,

  selectNetworkEventById,
  selectSortedNetworkEvents
};
