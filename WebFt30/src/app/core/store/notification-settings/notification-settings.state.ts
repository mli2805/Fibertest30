import { NotificationSettings } from '../models/notification-settings';

export interface NotificationSettingsState {
  notificationSettings: NotificationSettings | null;
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
  testingEmailServer: boolean;
  testEmailServerSuccess: boolean | null;
  testEmailServerFailureId: string | null;
  testingTrapReceiver: boolean;
  testTrapReceiverSuccess: boolean | null;
  testTrapReceiverFailureId: string | null;
}
