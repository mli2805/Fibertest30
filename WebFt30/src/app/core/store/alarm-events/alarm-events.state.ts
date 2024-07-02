import { ServerError } from '../../models/server-error';
import { MonitoringAlarmEvent } from '../models';

export interface AlarmEventsState {
  alarmEvents: MonitoringAlarmEvent[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
