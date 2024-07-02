import { NetworkSettings } from '../models/network-settings';

export interface NetworkSettingsState {
  networkSettings: NetworkSettings | null;
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
}
