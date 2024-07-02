import { createSelector } from '@ngrx/store';

import { selectAuthState } from 'src/app/core/core.state';
import { AuthState } from './auth.state';
import { User } from '../store/models/user';
import { ApplicationPermission } from '../models/app-permissions';
import { ServerError } from '../models/server-error';
import { GrpcUtils } from '../grpc/grpc.utils';
import { CoreUtils } from '../core.utils';

const selectAuth = createSelector(selectAuthState, (state: AuthState) => state);

const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.token != null
);

const selectToken = createSelector(selectAuthState, (state: AuthState) => state.token);

const selectUser = createSelector(selectAuthState, (state: AuthState) => state.user);

const selectHasOnDemandPermission = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.PerformOnDemandTest) : false
);

const selectHasEditUsersPermission = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.EditUsers) : false
);

const selectHasOtauConfigurationPermisson = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.ConfigureOtau) : false
);

const selectHasChangeMonitoringPortSettingsPermisson = createSelector(
  selectUser,
  (user: User | null) =>
    user ? user.permissions.includes(ApplicationPermission.ChangeMonitoringPortSettings) : false
);

const selectHasChangeNotificationSettingsPermission = createSelector(
  selectUser,
  (user: User | null) =>
    user ? user.permissions.includes(ApplicationPermission.ChangeNotificationSettings) : false
);

const selectHasChangeAlarmProfilesPermission = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.ChangeAlarmProfiles) : false
);

const selectHasChangeNetworkSettingsPermission = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.ChangeNetworkSettings) : false
);

const selectHasChangeTimeSettingsPermission = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.ChangeTimeSettings) : false
);

const selectErrorMessageId = createSelector(selectAuthState, (state: AuthState) => {
  if (state.error === null) {
    return null;
  }
  return CoreUtils.getErrorMessageId(state.error) ?? 'i18n.error.cant-sign-in';
});

export const AuthSelectors = {
  selectAuth,
  selectIsAuthenticated,
  selectToken,
  selectUser,
  selectHasOnDemandPermission,
  selectHasEditUsersPermission,
  selectHasOtauConfigurationPermisson,
  selectHasChangeNotificationSettingsPermission,
  selectHasChangeMonitoringPortSettingsPermisson,
  selectHasChangeAlarmProfilesPermission,
  selectHasChangeNetworkSettingsPermission,
  selectHasChangeTimeSettingsPermission,
  selectErrorMessageId
};
