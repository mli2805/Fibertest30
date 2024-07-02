import { createSelector } from '@ngrx/store';
import { selectSystemEventsState } from '../../core.state';
import { SystemEventsState } from './system-events.state';

const selectSystemEvents = createSelector(
  selectSystemEventsState,
  (state: SystemEventsState) => state
);

const selectEvents = createSelector(
  selectSystemEvents,
  (state: SystemEventsState) => state.systemEvents
);

const selectLoading = createSelector(
  selectSystemEvents,
  (state: SystemEventsState) => state.loading
);

const selectLoadedTime = createSelector(
  selectSystemEvents,
  (state: SystemEventsState) => state.loadedTime
);

const selectErrorMessageId = createSelector(selectSystemEvents, (state: SystemEventsState) => {
  if (state.error === null) {
    return null;
  }

  return 'i18n.system-events.cant-load-system-events';
});

export const SystemEventsSelectors = {
  selectSystemEvents,
  selectEvents,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId
};
