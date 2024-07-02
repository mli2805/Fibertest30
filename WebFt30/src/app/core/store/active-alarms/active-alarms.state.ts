import { EntityState } from '@ngrx/entity';
import { MonitoringAlarm } from '../models';
import { ServerError } from '../../models/server-error';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActiveAlarmsState extends EntityState<MonitoringAlarm> {
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
