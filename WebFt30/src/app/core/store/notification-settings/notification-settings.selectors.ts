import { createSelector } from '@ngrx/store';
import { NotificationSettingsState } from './notification-settings.state';
import { selectNotificationSettingsState } from '../../core.state';

const selectNotificationSettingsSet = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.notificationSettings
);

const selectLoaded = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.loaded
);
const selectLoading = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.loading
);
const selectErrorMessageId = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.errorMessageId
);
const selectTestingEmailServer = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.testingEmailServer
);
const selectTestEmailServerSuccess = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.testEmailServerSuccess
);
const selectTestingEmailServerFailureId = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.testEmailServerFailureId
);

const selectTestingTrapReceiver = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.testingTrapReceiver
);
const selectTestTrapReceiverSuccess = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.testTrapReceiverSuccess
);
const selectTestingTrapReceiverFailureId = createSelector(
  selectNotificationSettingsState,
  (state: NotificationSettingsState) => state.testTrapReceiverFailureId
);

export const NotificationSettingsSelectors = {
  selectNotificationSettingsSet,
  selectLoaded,
  selectLoading,
  selectErrorMessageId,
  selectTestingEmailServer,
  selectTestEmailServerSuccess,
  selectTestingEmailServerFailureId,
  selectTestingTrapReceiver,
  selectTestTrapReceiverSuccess,
  selectTestingTrapReceiverFailureId
};
