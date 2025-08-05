import { createSelector } from '@ngrx/store';
import { selectBopEventsState } from '../../core.state';
import { BopEventsState } from './bop-events.state';
import { BopEvent } from '../models/ft30/bop-event';
import { BopEventsStateAdapter } from './bop-events.reduces';

const { selectAll, selectEntities, selectTotal } = BopEventsStateAdapter.getSelectors();

const selectBopEvents = createSelector(selectBopEventsState, selectAll);

const selectLoading = createSelector(
  selectBopEventsState,
  (state: BopEventsState) => state.loading
);

const selectErrorMessageId = createSelector(selectBopEventsState, (state: BopEventsState) => {
  if (state.error === null) {
    return null;
  }

  return 'i18n.ft.cant-load-bop-events';
});

const selectBopEventById = (eventId: number) =>
  createSelector(selectBopEvents, (opEvents: BopEvent[] | null) => {
    return opEvents?.find((o) => o.eventId === eventId) || null;
  });

export const selectSortedBopEvents = createSelector(selectBopEvents, (events): BopEvent[] =>
  events
    .slice() // создаём копию массива, чтобы не мутировать оригинал
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
);

export const BopEventsSelectors = {
  selectBopEvents,
  selectLoading,
  selectErrorMessageId,

  selectBopEventById,
  selectSortedBopEvents
};
