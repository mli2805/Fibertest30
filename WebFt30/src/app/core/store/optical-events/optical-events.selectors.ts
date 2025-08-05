import { createSelector } from '@ngrx/store';
import { selectOpticalEventsState } from '../../core.state';
import { OpticalEventsState } from './optical-events.state';
import { OpticalEventsStateAdapter } from './optical-events.reducer';
import { OpticalEvent } from '../models/ft30/optical-event';

const { selectAll, selectEntities, selectTotal } = OpticalEventsStateAdapter.getSelectors();

const selectOpticalEvents = createSelector(selectOpticalEventsState, selectAll);

const selectLoading = createSelector(
  selectOpticalEventsState,
  (state: OpticalEventsState) => state.loading
);

const selectErrorMessageId = createSelector(
  selectOpticalEventsState,
  (state: OpticalEventsState) => {
    if (state.error === null) {
      return null;
    }

    return 'i18n.ft.cant-load-optical-events';
  }
);

const selectOpticalEventById = (eventId: number) =>
  createSelector(selectOpticalEventsState, (state) => state.entities[eventId]);

export const selectSortedOpticalEvents = createSelector(
  selectOpticalEvents,
  (events): OpticalEvent[] =>
    events
      .slice() // создаём копию массива, чтобы не мутировать оригинал
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
);

export const OpticalEventsSelectors = {
  // selectOpticalEvents,
  selectSortedOpticalEvents,
  selectLoading,
  selectErrorMessageId,

  selectOpticalEventById
};
