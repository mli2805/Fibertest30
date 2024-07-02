import { Action, createReducer, on } from '@ngrx/store';

import { AuthState } from './auth.state';
import { AuthActions } from './auth.actions';

export const initialState: AuthState = {
  loading: false,
  error: null,
  token: null,
  user: null
};

const reducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    // DO NOT reset the error, so login page shows the error constantly, this prevents shaking
    // error: null,
    user: null,
    loading: true
  })),

  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    loading: false,
    error: null,
    token,
    user
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    user: null
  })),

  on(AuthActions.refreshToken, (state) => ({
    ...state,
    error: null
  })),

  on(AuthActions.refreshTokenSuccess, (state, { token }) => ({
    ...state,
    token
  })),

  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    user: null
  })),

  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user
  })),
  on(AuthActions.updateCurrentUser, (state, { user }) => ({
    ...state,
    user
  }))
);

export function authReducer(state: AuthState | undefined, action: Action): AuthState {
  return reducer(state, action);
}
