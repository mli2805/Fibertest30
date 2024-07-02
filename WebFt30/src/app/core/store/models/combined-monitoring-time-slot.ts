import { MonitoringTimeSlot } from './monitoring-time-slot';

export interface CombinedMonitoringTimeSlot {
  timeSlot: MonitoringTimeSlot;
  used: boolean;
}
