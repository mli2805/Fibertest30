export class AppTimezone {
  ianaId!: string;
  displayName!: string;
  displayBaseUtcOffset!: string;

  // Device could have a timezone that is not available in a browser
  // In this case we use UTC timezone
  // But save original server timezone for show warning message in UI
  appliedDeviceTimeZone!: boolean;
  serverIanaId: string | null = null;
  serverDisplayName: string | null = null;
  serverDisplayBaseUtcOffset: string | null = null;

  static GetUtcTimeZone() {
    const utc = new AppTimezone();
    utc.ianaId = 'Etc/GMT';
    utc.displayName = '(UTC) Coordinated Universal Time';
    utc.displayBaseUtcOffset = 'UTC+00:00';
    return utc;
  }
}
