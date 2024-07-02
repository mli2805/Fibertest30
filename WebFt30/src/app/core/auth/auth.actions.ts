import { createAction, props } from '@ngrx/store';
import { User } from '../store/models/user';
import { UserSettings } from '../models/user-settings';
import { ServerError } from '../models/server-error';

const login = createAction(
  '[Authentication] Login',
  props<{ username: string; password: string }>()
);

const loginSuccess = createAction(
  '[Authentication] Login Success',
  props<{ token: string; user: User; settings: UserSettings | null }>()
);

const loginFailure = createAction(
  '[Authentication] Login Failure',
  props<{ error: ServerError | string }>()
);

// Local authentication doesn't require server-side logout.
// The user is logged out when the token is removed.
// For external authenication we probably will need to redirect to external logout url.
// In that case logoutSuccess and logoutFailure should be introduced to handle the response.
const logout = createAction('[Authentication] Logout');

const refreshToken = createAction('[Authentication] Refresh Tokens');

const refreshTokenSuccess = createAction(
  '[Authentication] Refresh Tokens Success',
  props<{ token: string }>()
);

const refreshTokenFailure = createAction(
  '[Authentication] Refresh Tokens Failure',
  props<{ error: ServerError }>()
);

const loadCurrentUser = createAction('[Authentication] Load Current User');

const loadCurrentUserSuccess = createAction(
  '[Authentication] Load Current User Success',
  props<{ user: User; settings: UserSettings | null }>()
);

const loadCurrentUserFailure = createAction(
  '[Authentication] Load Current User Failure',
  props<{ error: ServerError | string }>()
);

const updateCurrentUser = createAction(
  '[Authentication] Update Current User',
  props<{ user: User }>()
);

export const AuthActions = {
  login,
  loginSuccess,
  loginFailure,
  logout,
  refreshToken,
  refreshTokenSuccess,
  refreshTokenFailure,
  loadCurrentUser,
  loadCurrentUserSuccess,
  loadCurrentUserFailure,
  updateCurrentUser
};
