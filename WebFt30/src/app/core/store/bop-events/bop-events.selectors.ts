import { createSelector } from '@ngrx/store';
import { selectBopEventsState } from '../../core.state';
import { BopEventsState } from './bop-events.state';
import { BopEvent } from '../models/ft30/bop-event';

const selectBopEvents = createSelector(
  selectBopEventsState,
  (state: BopEventsState) => state.bopEvents
);

const selectLoading = createSelector(
  selectBopEventsState,
  (state: BopEventsState) => state.loading
);

const selectLoadedTime = createSelector(
  selectBopEventsState,
  (state: BopEventsState) => state.loadedTime
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

export const BopEventsSelectors = {
  selectBopEvents,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId,

  selectBopEventById
};
