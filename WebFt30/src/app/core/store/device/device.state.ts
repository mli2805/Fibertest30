import { NotificationSettings } from 'src/app/core/store/models/notification-settings';
import { AppTimezone, OtdrMeasurementParameters } from '../models';
import { Rtu } from '../models/ft30/rtu';

export interface DeviceState {
  deviceInfo: DeviceInfo | null;
  loading: boolean;
}

export class DeviceInfo {
  apiVersion!: string;
  supportedMeasurementParameters!: OtdrMeasurementParameters;
  notificationSettings!: NotificationSettings;
  rtus!: Rtu[];
}
