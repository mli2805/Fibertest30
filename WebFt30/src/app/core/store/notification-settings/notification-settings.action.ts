import { createAction, props } from '@ngrx/store';
import { EmailServer, NotificationSettings, TrapReceiver } from '../models/notification-settings';

const refreshNotificationSettings = createAction(
  '[NotificationSettings] Refresh Notification Settings'
);
const refreshNotificationSettingsSuccess = createAction(
  '[NotificationSettings] Refresh Notification Settings Success',
  props<{ settings: NotificationSettings }>()
);
const refreshNotificationSettingsFailure = createAction(
  '[NotificationSettings] Refresh Notification Settings Failure',
  props<{ errorMessageId: string }>()
);

const updateNotificationSettings = createAction(
  '[NotificationSettings] Update Notification Settings',
  props<{ settings: NotificationSettings }>()
);
const updateNotificationSettingsSuccess = createAction(
  '[NotificationSettings] Update Notification Settings Success'
);
const updateNotificationSettingsFailure = createAction(
  '[NotificationSettings] Update Notification Settings Failure',
  props<{ errorMessageId: string }>()
);

const testEmailServerSettings = createAction(
  '[NotificationSettings] Test Email Server Settings',
  props<{ emailServer: EmailServer }>()
);
const testEmailServerSettingsSuccess = createAction(
  '[NotificationSettings] Test Email Server Settings Success'
);
const testEmailServerSettingsFailure = createAction(
  '[NotificationSettings] Test Email Server Settings Failure',
  props<{ errorMessageId: string }>()
);

const testTrapReceiverSettings = createAction(
  '[NotificationSettings] Test Trap Receiver Settings',
  props<{ trapReceiver: TrapReceiver }>()
);

const testTrapReceiverSettingsSuccess = createAction(
  '[NotificationSettings] Test Trap Receiver Settings Success'
);

const testTrapReceiverSettingsFailure = createAction(
  '[NotificationSettings] Test Trap Receiver Settings Failure',
  props<{ errorMessageId: string }>()
);

export const NotificationSettingsActions = {
  refreshNotificationSettings,
  refreshNotificationSettingsSuccess,
  refreshNotificationSettingsFailure,

  updateNotificationSettings,
  updateNotificationSettingsSuccess,
  updateNotificationSettingsFailure,

  testEmailServerSettings,
  testEmailServerSettingsSuccess,
  testEmailServerSettingsFailure,

  testTrapReceiverSettings,
  testTrapReceiverSettingsSuccess,
  testTrapReceiverSettingsFailure
};
