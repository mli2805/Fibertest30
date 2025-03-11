import { createSelector } from '@ngrx/store';

import { selectAuthState } from 'src/app/core/core.state';
import { AuthState } from './auth.state';
import { User } from '../store/models/user';
import { ApplicationPermission } from '../models/app-permissions';
import { CoreUtils } from '../core.utils';

const selectAuth = createSelector(selectAuthState, (state: AuthState) => state);

const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.token != null
);

const selectToken = createSelector(selectAuthState, (state: AuthState) => state.token);

const selectUser = createSelector(selectAuthState, (state: AuthState) => state.user);

const selectHasEditUsersPermission = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.EditUsers) : false
);

const selectHasEditGraphPermission = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.EditGraph) : false
);

const selectHasInitializeRtuPermission = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.InitializeRtu) : false
);

const selectHasTestRtuPermission = createSelector(selectUser, (user: User | null) =>
  user ? user.permissions.includes(ApplicationPermission.CheckRtuConnection) : false
);

const selectHasChangeNotificationSettingsPermission = createSelector(
  selectUser,
  (user: User | null) =>
    user ? user.permissions.includes(ApplicationPermission.ChangeNotificationSettings) : false
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
  selectHasEditUsersPermission,
  selectHasEditGraphPermission,
  selectHasInitializeRtuPermission,
  selectHasTestRtuPermission,
  selectHasChangeNotificationSettingsPermission,
  selectErrorMessageId
};
