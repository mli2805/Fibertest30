import { NotificationSettings } from 'src/app/core/store/models/notification-settings';
import { Rtu } from '../models/ft30/rtu';
import { HasCurrentEvents } from '../models/ft30/has-current-events';

export interface DeviceState {
  deviceInfo: DeviceInfo | null;
  loading: boolean;
}

export class DeviceInfo {
  apiVersion!: string;
  notificationSettings!: NotificationSettings;
  rtus!: Rtu[];
  hasCurrentEvents!: HasCurrentEvents;
}
