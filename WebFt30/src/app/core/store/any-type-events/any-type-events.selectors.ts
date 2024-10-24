import { selectAnyTypeEventsState } from '../../core.state';
import { AnyTypeEvent } from '../models/ft30/any-type-event';
import { AnyTypeEventsState } from './any-type-events.state';
import { createSelector } from '@ngrx/store';

const selectAnyTypeEvents = createSelector(
  selectAnyTypeEventsState,
  (state: AnyTypeEventsState) => state.anyTypeEvents
);

const selectOrderedEvents = createSelector(
  selectAnyTypeEventsState,
  (state: AnyTypeEventsState) => {
    const cloned = state.anyTypeEvents.map((x) => Object.assign({}, x));
    return cloned.sort((a, b) => (a.registeredAt > b.registeredAt ? -1 : 1));
  }
);

const selectHasAny = createSelector(
  selectAnyTypeEvents,
  (anyTypeEvents: AnyTypeEvent[]) => anyTypeEvents.length > 0
);

export const AnyTypeEventsSelectors = {
  selectAnyTypeEvents,
  selectOrderedEvents,
  selectHasAny
};
