import { NotificationSettings } from 'src/app/core/store/models/notification-settings';
import {
  AppTimezone,
  MonitoringAlarm,
  MonitoringPort,
  Otau,
  OtdrMeasurementParameters,
  PortLabel
} from '../models';
import { MonitoringTimeSlot } from '../models';
import { AlarmProfile } from '../models/alarm-profile';
import { NetworkSettings } from '../models/network-settings';
import { NtpSettings } from '../models/ntp-settings';
import { TimeSettings } from '../models/time-settings';
import { Rtu } from '../models/ft30/rtu';

export interface DeviceState {
  deviceInfo: DeviceInfo | null;
  loading: boolean;
}

export class DeviceInfo {
  serialNumber!: string;
  ipV4Address!: string;
  timezone!: AppTimezone;
  apiVersion!: string;
  supportedMeasurementParameters!: OtdrMeasurementParameters;
  otaus!: Otau[];
  monitoringPorts!: MonitoringPort[];
  monitoringTimeSlots!: MonitoringTimeSlot[];
  alarmProfiles!: AlarmProfile[];
  notificationSettings!: NotificationSettings;
  activeAlarms!: MonitoringAlarm[];
  networkSettings!: NetworkSettings;
  ntpSettings!: NtpSettings;
  timeSettings!: TimeSettings;
  portLabels!: PortLabel[];
  rtus!: Rtu[];
}
