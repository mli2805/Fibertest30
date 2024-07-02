import { EntityState } from '@ngrx/entity';
import { MonitoringPort } from '../models';
import { MonitoringTimeSlot } from '../models/monitoring-time-slot';

export interface MonitoringPortState extends EntityState<MonitoringPort> {
  loading: boolean;
  errorMessageId: string | null;
  timeSlots: MonitoringTimeSlot[];
}
