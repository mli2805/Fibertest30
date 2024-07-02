import { createSelector } from '@ngrx/store';
import { selectOnDemandHistoryState } from '../../core.state';
import { OnDemandHistoryState } from './on-demand-history.state';

const selectOnDemandHistory = createSelector(
  selectOnDemandHistoryState,
  (state: OnDemandHistoryState) => state
);

const selectOnDemands = createSelector(
  selectOnDemandHistory,
  (state: OnDemandHistoryState) => state.onDemands
);

const selectLoading = createSelector(
  selectOnDemandHistory,
  (state: OnDemandHistoryState) => state.loading
);

const selectLoadedTime = createSelector(
  selectOnDemandHistory,
  (state: OnDemandHistoryState) => state.loadedTime
);

const selectErrorMessageId = createSelector(
  selectOnDemandHistory,
  (state: OnDemandHistoryState) => {
    if (state.error === null) {
      return null;
    }

    return 'i18n.system-events.cant-load-on-demand-history';
  }
);

const selectHiglightOnDemandId = createSelector(
  selectOnDemandHistory,
  (state: OnDemandHistoryState) => state.higlightOnDemandId
);

export const OnDemandHistorySelectors = {
  selectOnDemandHistory,
  selectOnDemands,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId,
  selectHiglightOnDemandId
};
