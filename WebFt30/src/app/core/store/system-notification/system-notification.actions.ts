import { createAction, props } from '@ngrx/store';
import { SystemNotification, SystemEventLevel } from '../models';
import { ServerError } from '../../models/server-error';

const getNotifications = createAction('[SystemNotification] Get Notifications');

const getNotificationsSuccess = createAction(
  '[SystemNotification] Get Notifications Success',
  props<{ systemNotifications: SystemNotification[] }>()
);

const getNotificationsFailure = createAction(
  '[SystemNotification] Get Notifications Failure',
  props<{ error: ServerError }>()
);

const addNotification = createAction(
  '[SystemNotification] Add Notification',
  props<{ systemNotification: SystemNotification }>()
);

const setNotificationSeen = createAction(
  '[SystemNotification] Notification Seen',
  props<{ systemEventId: number }>()
);

const dismissNotification = createAction(
  '[SystemNotification] Dismiss Notification',
  props<{ systemEventId: number }>()
);

const dismissNotificationSuccess = createAction(
  '[SystemNotification] Dismiss Notification Success',
  props<{ systemEventId: number }>()
);

const dismissNotificationsByLevel = createAction(
  '[SystemNotification] Dismiss Notifications By Level',
  props<{ systemEventLevel: SystemEventLevel }>()
);

const dismissNotificationsByLevelSuccess = createAction(
  '[SystemNotification] Dismiss Notifications By Level Success',
  props<{ systemEventLevel: SystemEventLevel }>()
);

const dismissAllNotifications = createAction('[SystemNotification] Dismiss All Notifications');

const dismissAllNotificationsSuccess = createAction(
  '[SystemNotification] Dismiss All Notifications Success'
);

const commonDismissNotificationFailure = createAction(
  '[SystemNotification] Common Dismiss Notification Failure',
  props<{ error: ServerError }>()
);

export const SystemNotificationActions = {
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
