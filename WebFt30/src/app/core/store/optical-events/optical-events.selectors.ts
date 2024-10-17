import { createSelector } from '@ngrx/store';
import { selectOpticalEventsState } from '../../core.state';
import { OpticalEventsState } from './optical-events.state';
import { OpticalEvent } from '../models/ft30/optical-event';

const selectOpticalEvents = createSelector(
  selectOpticalEventsState,
  (state: OpticalEventsState) => state.opticalEvents
);

const selectLoading = createSelector(
  selectOpticalEventsState,
  (state: OpticalEventsState) => state.loading
);

const selectLoadedTime = createSelector(
  selectOpticalEventsState,
  (state: OpticalEventsState) => state.loadedTime
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
  createSelector(selectOpticalEvents, (opEvents: OpticalEvent[] | null) => {
    return opEvents?.find((o) => o.eventId === eventId) || null;
  });

export const OpticalEventsSelectors = {
  selectOpticalEvents,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId,

  selectOpticalEventById
};
