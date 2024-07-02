import { createSelector } from '@ngrx/store';
import { GlobalUiState } from './global-ui.state';

import { selectGlobalUiState } from '../../core.state';
import { ServerError } from '../../models/server-error';

const selectGlobalUi = createSelector(selectGlobalUiState, (state: GlobalUiState) => state);

const selectLoading = createSelector(
  selectGlobalUi,
  (state: GlobalUiState) => state.loadingCount > 0
);

const selectError = createSelector(selectGlobalUi, (state: GlobalUiState) => {
  if (state.error === null) {
    return null;
  }

  if (state.error instanceof ServerError) {
    return `code: ${state.error.code} message: ${state.error.message}`;
  }

  return state.error;
});

const selectPopupErrorMessageId = createSelector(
  selectGlobalUi,
  (state: GlobalUiState) => state.popupErrorMessageId
);

const selectShowSystemNotification = createSelector(
  selectGlobalUi,
  (state: GlobalUiState) => state.showSystemNotification
);

const selectShowAlarmNotification = createSelector(
  selectGlobalUi,
  (state: GlobalUiState) => state.showAlarmNotification
);

export const GlobalUiSelectors = {
  selectGlobalUi,
  selectLoading,
  selectError,
  selectPopupErrorMessageId,
  selectShowSystemNotification,
  selectShowAlarmNotification
};
