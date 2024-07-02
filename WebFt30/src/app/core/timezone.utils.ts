export class TimezoneUtils {
  // NOTE: The Intl.supportedValuesOf('timeZone') does not return a full list of timezone values
  // that could be used by the Intl.DateTimeFormat
  // For example, Firefox returns Utc, but not Etc/Utc
  // Chrome doesn not return Utc at all
  // So, to check if timezone if supported we try creating Intl.DateTimeFormat and check if it throws an error

  static supportTimezoneByIanaId(ianaId: string): boolean | null {
    try {
      new Intl.DateTimeFormat(undefined, { timeZone: ianaId });
      return true;
    } catch (error) {
      return false;
    }
  }

  // static supportTimezoneByIanaId(ianaId: string): boolean | null {
  //   const supportedTimezones = TimezoneUtils.getSupportedTimezones();
  //   return supportedTimezones.find((x) => x === ianaId) ? true : false;
  // }

  // static getSupportedTimezones(): string[] {
  //   const environementTimeZones = (<any>Intl).supportedValuesOf('timeZone');
  //   return environementTimeZones;
  // }
}
