import { selectAnyTypeEventsState } from '../../core.state';
import { AnyTypeEvent } from '../models/ft30/any-type-event';
import { AnyTypeEventsState } from './any-type-events.state';
import { createSelector } from '@ngrx/store';

const selectAnyTypeEvents = createSelector(
  selectAnyTypeEventsState,
  (state: AnyTypeEventsState) => state.anyTypeEvents
);

const selectHasAny = createSelector(
  selectAnyTypeEvents,
  (anyTypeEvents: AnyTypeEvent[]) => anyTypeEvents.length > 0
);

export const AnyTypeEventsSelectors = {
  selectAnyTypeEvents,
  selectHasAny
};
