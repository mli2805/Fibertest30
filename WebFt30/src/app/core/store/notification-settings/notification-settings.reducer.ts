import { createEntityAdapter } from '@ngrx/entity';
import { NotificationSettings } from '../models/notification-settings';
import { NotificationSettingsState } from './notification-settings.state';
import { createReducer, on } from '@ngrx/store';
import { DeviceActions } from '../device/device.actions';
import { NotificationSettingsActions } from './notification-settings.action';

export const NotficationSettingsStateAdapter = createEntityAdapter<NotificationSettings>({
  selectId: (notificationSettings: NotificationSettings) => notificationSettings.id
});

export const initialState: NotificationSettingsState =
  NotficationSettingsStateAdapter.getInitialState({
    notificationSettings: null,
    loaded: false,
    loading: false,
    errorMessageId: null,
    testingEmailServer: false,
    testEmailServerSuccess: null,
    testEmailServerFailureId: null,
    testingTrapReceiver: false,
    testTrapReceiverSuccess: null,
    testTrapReceiverFailureId: null
  });

const reducer = createReducer(
  initialState,

  on(DeviceActions.loadDeviceInfo, (state) => ({
    ...state,
    loaded: false,
    loading: true
  })),

  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo }) => ({
    ...state,
    loaded: true,
    loading: false,
    notificationSettings: deviceInfo.notificationSettings
  })),

  on(NotificationSettingsActions.updateNotificationSettings, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null,
    testEmailServerFailureId: null,
    testTrapReceiverFailureId: null
  })),
  on(
    NotificationSettingsActions.updateNotificationSettingsFailure,
    (state, { errorMessageId }) => ({
      ...state,
      loading: false,
      errorMessageId
    })
  ),

  on(NotificationSettingsActions.refreshNotificationSettings, (state) => ({
    ...state,
    loaded: false,
    loading: true,
    testEmailServerSuccess: null,
    testEmailServerFailureId: null,
    testTrapReceiverSuccess: null,
    testTrapReceiverFailureId: null
  })),
  on(NotificationSettingsActions.refreshNotificationSettingsSuccess, (state, { settings }) => ({
    ...state,
    loaded: true,
    loading: false,
    notificationSettings: settings
  })),

  on(NotificationSettingsActions.testEmailServerSettings, (state) => ({
    ...state,
    testingEmailServer: true,
    testEmailServerSuccess: null,
    testEmailServerFailureId: null,
    errorMessageId: null
  })),
  on(NotificationSettingsActions.testEmailServerSettingsSuccess, (state) => ({
    ...state,
    testingEmailServer: false,
    testEmailServerSuccess: true,
    testEmailServerFailureId: null
  })),
  on(NotificationSettingsActions.testEmailServerSettingsFailure, (state, { errorMessageId }) => ({
    ...state,
    testingEmailServer: false,
    testEmailServerSuccess: null,
    testEmailServerFailureId: errorMessageId
  })),

  on(NotificationSettingsActions.testTrapReceiverSettings, (state) => ({
    ...state,
    testingTrapReceiver: true,
    testTrapReceiverSuccess: null,
    testTrapReceiverFailureId: null,
    errorMessageId: null
  })),
  on(NotificationSettingsActions.testTrapReceiverSettingsSuccess, (state) => ({
    ...state,
    testingTrapReceiver: false,
    testTrapReceiverSuccess: true,
    testTrapReceiverFailureId: null
  })),
  on(NotificationSettingsActions.testTrapReceiverSettingsFailure, (state, { errorMessageId }) => ({
    ...state,
    testingTrapReceiver: false,
    testTrapReceiverSuccess: null,
    testTrapReceiverFailureId: errorMessageId
  }))
);

export function notificationSettingsReducer(
  state: NotificationSettingsState | undefined,
  action: any
): NotificationSettingsState {
  return reducer(state, action);
}
