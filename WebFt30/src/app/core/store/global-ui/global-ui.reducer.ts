import { createReducer, on } from '@ngrx/store';

import { GlobalUiState } from './global-ui.state';
import { GlobalUiActions } from './global-ui.actions';
import { AuthActions } from '../../auth/auth.actions';

export const initialState: GlobalUiState = {
  loadingCount: 0,
  error: null,
  popupErrorMessageId: null,
  showAlarmNotification: false,
  showSystemNotification: false
};

const reducer = createReducer(
  initialState,
  on(GlobalUiActions.showInitialLoading, (state) => ({
    ...state,
    // After user login or restore session (getCurrentUser)
    // the app always preloads users (global ui is not called for this), then get device info and notifications
    // let's show continious loading progress bar until we load all of those
    // So, we start from loadingCount 3, and then all descrease by one
    loadingCount: 3
  })),
  on(AuthActions.loginFailure, (state) => ({
    ...state,
    loadingCount: 1 // one because hideLoading in finalizer will be called
  })),
  on(AuthActions.loadCurrentUserFailure, (state) => ({
    ...state,
    loadingCount: 1 // one because hideLoading in finalizer will be called
  })),
  on(GlobalUiActions.showLoading, (state) => ({
    ...state,
    loadingCount: state.loadingCount + 1
  })),
  on(GlobalUiActions.hideLoading, (state) => ({
    ...state,
    loadingCount: state.loadingCount - 1
  })),
  on(GlobalUiActions.resetLoading, (state) => ({
    ...state,
    loadingCount: 0
  })),
  on(GlobalUiActions.showError, (state, { error }) => ({
    ...state,
    error
  })),
  on(GlobalUiActions.showPopupError, (state, { popupErrorMessageId }) => ({
    ...state,
    popupErrorMessageId
  })),
  on(GlobalUiActions.hidePopupError, (state) => ({
    ...state,
    popupErrorMessageId: null
  })),
  on(GlobalUiActions.toggleSystemNotification, (state) => {
    return {
      ...state,
      showSystemNotification: !state.showSystemNotification,
      showAlarmNotification: false
    };
  }),
  on(GlobalUiActions.toggleAlarmNotification, (state) => {
    return {
      ...state,
      showSystemNotification: false,
      showAlarmNotification: !state.showAlarmNotification
    };
  })
);

export function globalUiReducer(state: GlobalUiState | undefined, action: any): GlobalUiState {
  return reducer(state, action);
}
