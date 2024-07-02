import { createSelector } from '@ngrx/store';
import { AlarmNotificationStateAdapter } from './alarm-notification.reducer';
import { selectAlarmNotificationState } from '../../core.state';
import { AlarmNotificationState } from './alarm-notification.state';

const { selectIds, selectEntities, selectAll, selectTotal } =
  AlarmNotificationStateAdapter.getSelectors();

const selectAlarmNotification = createSelector(
  selectAlarmNotificationState,
  (state: AlarmNotificationState) => state
);

const selectAlarmNotificationNotifications = createSelector(selectAlarmNotification, selectAll);

const selectTotalCount = createSelector(selectAlarmNotification, selectTotal);

export const AlarmNotificationSelectors = {
  selectAlarmNotification,
  selectAlarmNotificationNotifications,
  selectTotalCount
};
