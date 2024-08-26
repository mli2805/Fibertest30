import { createSelector } from '@ngrx/store';
import { selectOpticalEventsState } from '../../core.state';
import { OpticalEventsState } from './optical-events.state';

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

    return 'i18n.optical-events.cant-load-optical-events';
  }
);

export const OpticalEventsSelectors = {
  selectOpticalEvents,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId
};
