import { createAction, props } from '@ngrx/store';
import { AlarmNotification, MonitoringAlarmLevel } from '../models';
import { ServerError } from '../../models/server-error';

const getNotifications = createAction('[AlarmNotification] Get Notifications');

const getNotificationsSuccess = createAction(
  '[AlarmNotification] Get Notifications Success',
  props<{ alarmNotifications: AlarmNotification[] }>()
);

const getNotificationsFailure = createAction(
  '[AlarmNotification] Get Notifications Failure',
  props<{ error: ServerError }>()
);

const addNotification = createAction(
  '[AlarmNotification] Add Notification',
  props<{ alarmNotification: AlarmNotification }>()
);

const setNotificationSeen = createAction(
  '[AlarmNotification] Notification Seen',
  props<{ alarmEventId: number }>()
);

const dismissNotification = createAction(
  '[AlarmNotification] Dismiss Notification',
  props<{ alarmEventId: number }>()
);

const dismissNotificationSuccess = createAction(
  '[AlarmNotification] Dismiss Notification Success',
  props<{ alarmEventId: number }>()
);

const dismissNotificationsByLevel = createAction(
  '[AlarmNotification] Dismiss Notifications By Level',
  props<{ alarmLevel: MonitoringAlarmLevel }>()
);

const dismissNotificationsByLevelSuccess = createAction(
  '[AlarmNotification] Dismiss Notifications By Level Success',
  props<{ alarmLevel: MonitoringAlarmLevel }>()
);

const dismissAllNotifications = createAction('[AlarmNotification] Dismiss All Notifications');

const dismissAllNotificationsSuccess = createAction(
  '[AlarmNotification] Dismiss All Notifications Success'
);

const commonDismissNotificationFailure = createAction(
  '[AlarmNotification] Common Dismiss Notification Failure',
  props<{ error: ServerError }>()
);

export const AlarmNotificationActions = {
  getNotifications,
  getNotificationsSuccess,
  getNotificationsFailure,
  addNotification,
  setNotificationSeen,
  dismissNotification,
  dismissNotificationSuccess,
  dismissNotificationsByLevel,
  dismissNotificationsByLevelSuccess,
  dismissAllNotifications,
  dismissAllNotificationsSuccess,
  commonDismissNotificationFailure
};
