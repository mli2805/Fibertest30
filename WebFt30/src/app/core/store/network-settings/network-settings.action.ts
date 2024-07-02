import { createAction, props } from '@ngrx/store';
import { NetworkSettings } from '../models/network-settings';

const refreshNetworkSettings = createAction('[NetworkSettings] Refresh Network Settings');

const refreshNetworkSettingsSuccess = createAction(
  '[NetworkSettings] Refresh Network Settings Success',
  props<{ settings: NetworkSettings }>()
);

const refreshNetworkSettingsFailure = createAction(
  '[NetworkSettings] Refresh Network Settings Failure',
  props<{ errorMessageId: string }>()
);

const updateNetworkSettings = createAction(
  '[NetworkSettings] Update Network Settings',
  props<{ settings: NetworkSettings }>()
);

const updateNetworkSettingsSuccess = createAction(
  '[NetworkSettings] Update Network Settings Success'
);

const updateNetworkSettingsFailure = createAction(
  '[NetworkSettings] Update Network Settings Failure',
  props<{ errorMessageId: string }>()
);

export const NetworkSettingsActions = {
  refreshNetworkSettings,
  refreshNetworkSettingsSuccess,
  refreshNetworkSettingsFailure,

  updateNetworkSettings,
  updateNetworkSettingsSuccess,
  updateNetworkSettingsFailure
};
