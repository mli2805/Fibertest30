import { createSelector } from '@ngrx/store';
import { selectNetworkSettingsState } from '../../core.state';
import { NetworkSettingsState } from './network-settings.state';

const selectNetworkSettings = createSelector(
  selectNetworkSettingsState,
  (state: NetworkSettingsState) => state.networkSettings
);

const selectLoading = createSelector(
  selectNetworkSettingsState,
  (state: NetworkSettingsState) => state.loading
);

const selectErrorMessageId = createSelector(
  selectNetworkSettingsState,
  (state: NetworkSettingsState) => state.errorMessageId
);

export const NetworkSettingsSelectors = {
  selectNetworkSettings,
  selectLoading,
  selectErrorMessageId
};
