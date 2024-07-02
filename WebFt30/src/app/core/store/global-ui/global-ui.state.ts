// GlobalUi state is used to show
// - global loading spinner
// - global error (redirected to /error page)
export interface GlobalUiState {
  loadingCount: number;
  error: any | null;
  popupErrorMessageId: any | null;
  showSystemNotification: boolean;
  showAlarmNotification: boolean;
}
