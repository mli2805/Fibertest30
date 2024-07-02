import { createSelector } from '@ngrx/store';
import { selectMonitoringHistoryState } from '../../core.state';
import { MonitoringHistoryState } from './monitoring-history.state';

const selectMonitoringHistory = createSelector(
  selectMonitoringHistoryState,
  (state: MonitoringHistoryState) => state
);

const selectMonitorings = createSelector(
  selectMonitoringHistory,
  (state: MonitoringHistoryState) => state.monitorings
);

const selectLoading = createSelector(
  selectMonitoringHistory,
  (state: MonitoringHistoryState) => state.loading
);

const selectLoadedTime = createSelector(
  selectMonitoringHistory,
  (state: MonitoringHistoryState) => state.loadedTime
);

const selectErrorMessageId = createSelector(
  selectMonitoringHistory,
  (state: MonitoringHistoryState) => {
    if (state.error === null) {
      return null;
    }

    return 'i18n.system-events.cant-load-monitoring-history';
  }
);

export const MonitoringHistorySelectors = {
  selectMonitoringHistory,
  selectMonitorings,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId
};
