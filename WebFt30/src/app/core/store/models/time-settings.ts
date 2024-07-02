import { AppTimezone } from './app-time-zone';
import { NtpSettings } from './ntp-settings';

export class TimeSettings {
  timeZone!: AppTimezone;
  ntpSettings!: NtpSettings;
}
