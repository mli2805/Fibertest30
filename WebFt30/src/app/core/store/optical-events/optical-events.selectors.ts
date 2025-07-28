import { createSelector } from '@ngrx/store';
import { selectOpticalEventsState } from '../../core.state';
import { OpticalEventsState } from './optical-events.state';
import { OpticalEventsStateAdapter } from './optical-events.reducer';

const { selectAll, selectEntities, selectTotal } = OpticalEventsStateAdapter.getSelectors();

const selectOpticalEvents = createSelector(selectOpticalEventsState, selectAll);

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
  createSelector(selectOpticalEventsState, (state) => state.entities[eventId]);

export const OpticalEventsSelectors = {
  selectOpticalEvents,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId,

  selectOpticalEventById
};
