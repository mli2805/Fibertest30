import { AppTimezone } from './app-time-zone';

export class NtpSettings {
  primaryNtpServer!: string | null;
  secondaryNtpServer!: string | null;
}
