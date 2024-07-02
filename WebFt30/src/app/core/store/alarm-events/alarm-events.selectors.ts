import { createSelector } from '@ngrx/store';
import { selectAlarmEventsHistory } from '../../core.state';
import { AlarmEventsState } from './alarm-events.state';

const selectAlarmEventsPart = createSelector(
  selectAlarmEventsHistory,
  (state: AlarmEventsState) => state
);

const selectAlarmEvents = createSelector(
  selectAlarmEventsPart,
  (state: AlarmEventsState) => state.alarmEvents
);
const selectLoading = createSelector(
  selectAlarmEventsPart,
  (state: AlarmEventsState) => state.loading
);
const selectLoadedTime = createSelector(
  selectAlarmEventsPart,
  (state: AlarmEventsState) => state.loadedTime
);
const selectErrorMessageId = createSelector(selectAlarmEventsPart, (state: AlarmEventsState) => {
  if (state.error === null) {
    return null;
  }

  return 'i18n.alarm-events.cant-load-alarm-events';
});

export const AlarmEventsSelectors = {
  selectAlarmEvents,
  selectLoading,
  selectLoadedTime,
  selectErrorMessageId
};
