import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';

import { AuthState } from './auth/auth.state';
import { SettingsState } from './store/settings/settings.state';
import { DeviceState } from './store/device/device.state';
import { OnDemandState } from './store/on-demand/on-demand.state';
import { RouterStateUrl } from './router/router.state';
import { GlobalUiState } from './store/global-ui/global-ui.state';
import { authReducer } from './auth/auth.reducer';
import { settingsReducer } from './store/settings/settings.reducer';
import { deviceReducer } from './store/device/device.reducer';
import { onDemandReducer } from './store/on-demand/on-demand.reducer';
import { globalUiReducer } from './store/global-ui/global-ui.reducer';
import { environment } from 'src/environments/environment';
import { initStateFromLocalStorage, onDemandErrorHook } from './meta-reducers';
import { UsersState } from './store/users/users.state';
import { RolesState } from './store/roles/roles.state';
import { usersReducer } from './store/users/users.reducer';
import { SystemEventsState } from './store/system-events/system-events.state';
import { systemEventsReducer } from './store/system-events/system-events.reducer';
import { SystemNotificationState } from './store/system-notification/system-notification.state';
import { systemNotificationReducer } from './store/system-notification/system-notification.reducer';
import { rolesReducer } from './store/roles/roles.reduces';
import { OnDemandHistoryState } from './store/on-demand-history/on-demand-history.state';
import { onDemandHistoryReducer } from './store/on-demand-history/on-demand-history.reducer';
import { OtausState } from './store/otaus/otaus.state';
import { otausReducer } from './store/otaus/otaus.reducer';
import { MonitoringPortState } from './store/monitoring/monitoring-port.state';
import { monitoringPortReducer } from './store/monitoring/monitoring-port.reducer';
import { MonitoringHistoryState } from './store/monitoring-history/monitoring-history.state';
import { monitoringHistoryReducer } from './store/monitoring-history/monitoring-history.reducer';
import { BaselineSetupState } from './store/baseline/baseline-setup.state';
import { baselineSetupReducer } from './store/baseline/baseline-setup.reducer';
import { AlarmProfilesState } from './store/alarm-profile/alarm-profiles.state';
import { alarmProfilesReducer } from './store/alarm-profile/alarm-profiles.reducer';
import { AlarmNotificationState } from './store/alarm-notification/alarm-notification.state';
import { alarmNotificationReducer } from './store/alarm-notification/alarm-notification.reducer';
import { NotificationSettingsState } from './store/notification-settings/notification-settings.state';
import { notificationSettingsReducer } from './store/notification-settings/notification-settings.reducer';
import { ActiveAlarmsState } from './store/active-alarms/active-alarms.state';
import { activeAlarmsReducer } from './store/active-alarms/active-alarms.reducer';
import { QuickAnalysisState } from './store/quick-analysis/quick-analysis.state';
import { quickAnalysisReducer } from './store/quick-analysis/quick-analysis.reducer';
import { TestQueueState } from './store/test-queue/test-queue.state';
import { testQueueReducer } from './store/test-queue/test-queue.reducer';
import { AlarmEventsState } from './store/alarm-events/alarm-events.state';
import { alarmEventsReducer } from './store/alarm-events/alarm-events.reducers';
import { AllAlarmsState } from './store/all-alarms/all-alarms.state';
import { allAlarmsReducer } from './store/all-alarms/all-alarms.reducer';
import { BaselineHistoryState } from './store/baseline-history/baseline-history.state';
import { baselineHistoryReducer } from './store/baseline-history/baseline-history.reducer';
import { NetworkSettingsState } from './store/network-settings/network-settings.state';
import { networkSettingsReducer } from './store/network-settings/network-settings.reducer';
import { PortLabelsState } from './store/port-labels/port-labels.state';
import { portLabelsReducer } from './store/port-labels/port-labels.reducer';
import { timeSettingsReducer } from './store/time-settings/time-settings.reducer';
import { TimeSettingsState } from './store/time-settings/time-settings.state';

export interface AppState {
  auth: AuthState;
  settings: SettingsState;
  device: DeviceState;
  onDemand: OnDemandState;
  onDemandHistory: OnDemandHistoryState;
  monitoringHistory: MonitoringHistoryState;
  alarmEventsHistory: AlarmEventsState;
  users: UsersState;
  roles: RolesState;
  otaus: OtausState;
  globalUi: GlobalUiState;
  systemEvents: SystemEventsState;
  alarmNotification: AlarmNotificationState;
  eventNotification: SystemNotificationState;
  monitoringPort: MonitoringPortState;
  baselineSetup: BaselineSetupState;
  alarmProfiles: AlarmProfilesState;
  notificationSettings: NotificationSettingsState;
  activeAlarms: ActiveAlarmsState;
  allAlarms: AllAlarmsState;
  quickAnalysis: QuickAnalysisState;
  testQueue: TestQueueState;
  baselineHistory: BaselineHistoryState;
  router: RouterReducerState<RouterStateUrl>;
  networkSettings: NetworkSettingsState;
  timeSettings: TimeSettingsState;
  portLabels: PortLabelsState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  settings: settingsReducer,
  device: deviceReducer,
  onDemand: onDemandReducer,
  onDemandHistory: onDemandHistoryReducer,
  monitoringHistory: monitoringHistoryReducer,
  alarmEventsHistory: alarmEventsReducer,
  users: usersReducer,
  roles: rolesReducer,
  otaus: otausReducer,
  globalUi: globalUiReducer,
  systemEvents: systemEventsReducer,
  alarmNotification: alarmNotificationReducer,
  eventNotification: systemNotificationReducer,
  monitoringPort: monitoringPortReducer,
  baselineSetup: baselineSetupReducer,
  alarmProfiles: alarmProfilesReducer,
  notificationSettings: notificationSettingsReducer,
  activeAlarms: activeAlarmsReducer,
  allAlarms: allAlarmsReducer,
  quickAnalysis: quickAnalysisReducer,
  testQueue: testQueueReducer,
  baselineHistory: baselineHistoryReducer,
  router: routerReducer,
  networkSettings: networkSettingsReducer,
  timeSettings: timeSettingsReducer,
  portLabels: portLabelsReducer
};

// better to use Chrome's Redux DevTools plugin instead of 'debug' metaReducer
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [initStateFromLocalStorage, onDemandErrorHook /*, debug*/]
  : [initStateFromLocalStorage, onDemandErrorHook];

export const selectAuthState = (state: AppState) => state.auth;
export const selectSettingsState = (state: AppState) => state.settings;
export const selectRouterState = (state: AppState) => state.router;
export const selectDeviceState = (state: AppState) => state.device;
export const selectOnDemandState = (state: AppState) => state.onDemand;
export const selectOnDemandHistoryState = (state: AppState) => state.onDemandHistory;
export const selectMonitoringHistoryState = (state: AppState) => state.monitoringHistory;
export const selectAlarmEventsHistory = (state: AppState) => state.alarmEventsHistory;
export const selectUsersState = (state: AppState) => state.users;
export const selectRolesState = (state: AppState) => state.roles;
export const selectOtausState = (state: AppState) => state.otaus;
export const selectGlobalUiState = (state: AppState) => state.globalUi;
export const selectSystemEventsState = (state: AppState) => state.systemEvents;
export const selectAlarmNotificationState = (state: AppState) => state.alarmNotification;
export const selectSystemNotificationState = (state: AppState) => state.eventNotification;
export const selectMonitoringPortState = (state: AppState) => state.monitoringPort;
export const selectBaselineSetupState = (state: AppState) => state.baselineSetup;
export const selectAlarmProfilesState = (state: AppState) => state.alarmProfiles;
export const selectNotificationSettingsState = (state: AppState) => state.notificationSettings;
export const selectActiveAlarmsState = (state: AppState) => state.activeAlarms;
export const selectAllAlarmsState = (state: AppState) => state.allAlarms;
export const selectQuickAnalysisState = (state: AppState) => state.quickAnalysis;
export const selectTestQueueState = (state: AppState) => state.testQueue;
export const selectBaselineHistoryState = (state: AppState) => state.baselineHistory;
export const selectNetworkSettingsState = (state: AppState) => state.networkSettings;
export const selectTimeSettingsState = (state: AppState) => state.timeSettings;
export const selectPortLabelsState = (state: AppState) => state.portLabels;
