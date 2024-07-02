import { ServerError } from '../../models/server-error';
import { MonitoringAlarm } from '../models';

export interface AllAlarmsState {
  allAlarms: MonitoringAlarm[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
