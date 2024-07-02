import { createSelector } from '@ngrx/store';
import { AllAlarmsState } from './all-alarms.state';
import { selectAllAlarmsState } from '../../core.state';
import { MonitoringAlarm } from '../models';

const selectAllAlarmsPart = createSelector(selectAllAlarmsState, (state: AllAlarmsState) => state);

const selectAllAlarms = createSelector(
  selectAllAlarmsPart,
  (state: AllAlarmsState) => state.allAlarms
);

const selectLoading = createSelector(selectAllAlarmsPart, (state: AllAlarmsState) => state.loading);

const selectLoaded = createSelector(
  selectAllAlarmsPart,
  (state: AllAlarmsState) => state.loadedTime !== null
);

const selectLoadedTime = createSelector(
  selectAllAlarmsPart,
  (state: AllAlarmsState) => state.loadedTime
);

const selectErrorMessageId = createSelector(selectAllAlarmsPart, (state: AllAlarmsState) => {
  if (state.error === null) {
    return null;
  }

  return 'i18n.all-alarms.cant-load-all-alarms';
});

export const AllAlarmsSelectors = {
  selectAllAlarms,
  selectLoading,
  selectLoadedTime,
  selectLoaded,
  selectErrorMessageId
};
