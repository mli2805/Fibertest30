import { createSelector } from '@ngrx/store';
import { ActiveAlarmsStateAdapter } from './active-alarms.reducer';
import { ActiveAlarmsState } from './active-alarms.state';
import { selectActiveAlarmsState } from '../../core.state';
import { MonitoringAlarm } from '../models';

const { selectAll, selectTotal } = ActiveAlarmsStateAdapter.getSelectors();

const selectActiveAlarms = createSelector(
  selectActiveAlarmsState,
  (state: ActiveAlarmsState) => state
);

const selectActiveAlarmsAlarms = createSelector(selectActiveAlarms, selectAll);

const selectTotalCount = createSelector(selectActiveAlarms, selectTotal);

const selectLoading = createSelector(
  selectActiveAlarms,
  (state: ActiveAlarmsState) => state.loading
);

const selectLoaded = createSelector(
  selectActiveAlarms,
  (state: ActiveAlarmsState) => state.loadedTime !== null
);

const selectLoadedTime = createSelector(
  selectActiveAlarms,
  (state: ActiveAlarmsState) => state.loadedTime
);

const selectActiveAlarmsByMonitoringPortId = (monitoringPortId: number) =>
  createSelector(selectActiveAlarms, (state: ActiveAlarmsState) => {
    return state.entities
      ? (Object.values(state.entities) as MonitoringAlarm[]).filter(
          (x) => x.monitoringPortId === monitoringPortId
        )
      : [];
  });

export const ActiveAlarmsSelectors = {
  selectActiveAlarms,
  selectActiveAlarmsAlarms,
  selectTotalCount,
  selectLoading,
  selectLoadedTime,
  selectLoaded,
  selectActiveAlarmsByMonitoringPortId
};
