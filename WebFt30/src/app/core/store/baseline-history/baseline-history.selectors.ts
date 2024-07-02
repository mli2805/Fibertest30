import { createSelector } from '@ngrx/store';
import { BaselineHistoryState } from './baseline-history.state';
import { selectBaselineHistoryState } from '../../core.state';

const selectBaselineHistory = createSelector(
  selectBaselineHistoryState,
  (state: BaselineHistoryState) => state
);
const selectBaselines = createSelector(
  selectBaselineHistory,
  (state: BaselineHistoryState) => state.baselines
);
const selectLoading = createSelector(
  selectBaselineHistory,
  (state: BaselineHistoryState) => state.loading
);

const selectLoadedTime = createSelector(
  selectBaselineHistory,
  (state: BaselineHistoryState) => state.loadedTime
);

const selectErrorMessageId = createSelector(
  selectBaselineHistory,
  (state: BaselineHistoryState) => {
    if (state.error === null) {
      return null;
    }

    return 'i18n.system-events.cant-load-baseline-history';
  }
);

export const BaselineHistorySelectors = {
  selectBaselineHistory,
  selectBaselines,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId
};
