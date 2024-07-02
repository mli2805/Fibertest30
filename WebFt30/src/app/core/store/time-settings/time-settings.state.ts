import { TimeSettings } from '../models/time-settings';

export interface TimeSettingsState {
  timeSettings: TimeSettings | null;
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
}
