import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';

import { AuthState } from './auth/auth.state';
import { SettingsState } from './store/settings/settings.state';
import { DeviceState } from './store/device/device.state';
import { RouterStateUrl } from './router/router.state';
import { GlobalUiState } from './store/global-ui/global-ui.state';
import { authReducer } from './auth/auth.reducer';
import { settingsReducer } from './store/settings/settings.reducer';
import { deviceReducer } from './store/device/device.reducer';
import { globalUiReducer } from './store/global-ui/global-ui.reducer';
import { environment } from 'src/environments/environment';
import { initStateFromLocalStorage } from './meta-reducers';
import { UsersState } from './store/users/users.state';
import { RolesState } from './store/roles/roles.state';
import { usersReducer } from './store/users/users.reducer';
import { SystemEventsState } from './store/system-events/system-events.state';
import { systemEventsReducer } from './store/system-events/system-events.reducer';
import { SystemNotificationState } from './store/system-notification/system-notification.state';
import { systemNotificationReducer } from './store/system-notification/system-notification.reducer';
import { rolesReducer } from './store/roles/roles.reduces';
import { NotificationSettingsState } from './store/notification-settings/notification-settings.state';
import { notificationSettingsReducer } from './store/notification-settings/notification-settings.reducer';
import { RtuTreeState } from './store/rtu-tree/rtu-tree.state';
import { rtuTreeReducer } from './store/rtu-tree/rtu-tree.reducer';
import { RtuMgmtState } from './store/rtu-mgmt/rtu-mgmt.state';
import { rtuMgmtReducer } from './store/rtu-mgmt/rtu-mgmt.reducer';
import { OpticalEventsState } from './store/optical-events/optical-events.state';
import { opticalEventsReducer } from './store/optical-events/optical-events.reducer';
import { NetworkEventsState } from './store/network-events/network-events.state';
import { BopEventsState } from './store/bop-events/bop-events.state';
import { RtuAccidentsState } from './store/rtu-accidents/rtu-accidents.state';
import { networkEventsReducer } from './store/network-events/network-events.reducer';
import { bopEventsReducer } from './store/bop-events/bop-events.reduces';
import { rtuAccidentsReducer } from './store/rtu-accidents/rtu-accidents.reducer';
import { AudioEventsState } from './store/audio-events/audio-events.state';
import { audioEventsReducer } from './store/audio-events/audio-events.reducer';
import { LandmarksModelsState } from './store/landmarks/landmarks-models.state';
import { landmarksModelsReducer } from './store/landmarks/landmarks-models.reducer';
import { ReportingState } from './store/reporting/reporting.state';
import { reportingReducer } from './store/reporting/reporting.reducer';

export interface AppState {
  auth: AuthState;
  settings: SettingsState;
  device: DeviceState;
  users: UsersState;
  roles: RolesState;
  globalUi: GlobalUiState;
  systemEvents: SystemEventsState;
  audioEvents: AudioEventsState;
  opticalEvents: OpticalEventsState;
  networkEvents: NetworkEventsState;
  bopEvents: BopEventsState;
  rtuAccidents: RtuAccidentsState;
  eventNotification: SystemNotificationState;
  notificationSettings: NotificationSettingsState;
  router: RouterReducerState<RouterStateUrl>;

  rtuTree: RtuTreeState;
  rtuMgmt: RtuMgmtState;
  landmarksModels: LandmarksModelsState;
  reporting: ReportingState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  settings: settingsReducer,
  device: deviceReducer,
  users: usersReducer,
  roles: rolesReducer,
  globalUi: globalUiReducer,
  systemEvents: systemEventsReducer,
  audioEvents: audioEventsReducer,
  opticalEvents: opticalEventsReducer,
  networkEvents: networkEventsReducer,
  bopEvents: bopEventsReducer,
  rtuAccidents: rtuAccidentsReducer,
  eventNotification: systemNotificationReducer,
  notificationSettings: notificationSettingsReducer,
  router: routerReducer,

  rtuTree: rtuTreeReducer,
  rtuMgmt: rtuMgmtReducer,
  landmarksModels: landmarksModelsReducer,
  reporting: reportingReducer
};

// better to use Chrome's Redux DevTools plugin instead of 'debug' metaReducer
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [initStateFromLocalStorage /*, debug*/]
  : [initStateFromLocalStorage];

export const selectAuthState = (state: AppState) => state.auth;
export const selectSettingsState = (state: AppState) => state.settings;
export const selectRouterState = (state: AppState) => state.router;
export const selectDeviceState = (state: AppState) => state.device;
export const selectUsersState = (state: AppState) => state.users;
export const selectRolesState = (state: AppState) => state.roles;
export const selectGlobalUiState = (state: AppState) => state.globalUi;
export const selectSystemEventsState = (state: AppState) => state.systemEvents;
export const selectAudioEventsState = (state: AppState) => state.audioEvents;
export const selectOpticalEventsState = (state: AppState) => state.opticalEvents;
export const selectNetworkEventsState = (state: AppState) => state.networkEvents;
export const selectBopEventsState = (state: AppState) => state.bopEvents;
export const selectRtuAccidentsState = (state: AppState) => state.rtuAccidents;
export const selectSystemNotificationState = (state: AppState) => state.eventNotification;
export const selectNotificationSettingsState = (state: AppState) => state.notificationSettings;
export const selectRtuTreeState = (state: AppState) => state.rtuTree;
export const selectRtuMgmtState = (state: AppState) => state.rtuMgmt;
export const selectLandmarksModelsState = (state: AppState) => state.landmarksModels;
export const selectReportingState = (state: AppState) => state.reporting;
