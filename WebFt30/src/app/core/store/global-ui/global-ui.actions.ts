import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';

const showInitialLoading = createAction('[Global UI] Show Initial Loading');

const showLoading = createAction('[Global UI] Show Loading');

const hideLoading = createAction('[Global UI] Hide Loading');

const resetLoading = createAction('[Global UI] Reset Loading');

const showError = createAction('[Global UI] Show Error', props<{ error: ServerError | string }>());

const showPopupError = createAction(
  '[Global UI] Show Popup Error',
  props<{ popupErrorMessageId: string }>()
);

const timeoutPopupError = createAction('[Global UI] Timeout Popup Error');

const hidePopupError = createAction('[Global UI] Hide Popup Error');

const toggleSystemNotification = createAction('[Global UI] Toggle Event Notification');

const toggleAlarmNotification = createAction('[Global UI] Toggle Alarm Notification');

const dummyAction = createAction('[Global UI] Dummy Action');

export const GlobalUiActions = {
  showInitialLoading,
  showLoading,
  hideLoading,
  resetLoading,
  showError,
  timeoutPopupError,
  hidePopupError,
  showPopupError,
  toggleSystemNotification,
  toggleAlarmNotification,
  dummyAction
};
