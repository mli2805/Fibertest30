import { Pipe, PipeTransform } from '@angular/core';
import momentZone from 'moment-timezone';

@Pipe({
    name: 'datePickTimeFormat',
    standalone: false
})
export class DatePickTimeFormatPipe implements PipeTransform {
  transform(date: Date, timezone: string, format = 'DD/MM/YYYY HH:mm:ss'): string {
    return DatePickTimeFormatPipe.format(date, timezone, format);
  }

  public static format(date: Date, timezone: string, format = 'DD/MM/YYYY HH:mm:ss') {
    const mountObj = momentZone(date);
    return mountObj.tz(timezone).format(format);
  }

  public static parse(dateString: string, timezone: string, format = 'DD/MM/YYYY HH:mm:ss') {
    momentZone.tz(timezone);
    const mountObj = momentZone(dateString, format, true);
    return mountObj.toDate();
  }

  /**
   *
   * @param date
   * @param format
   */
  public static formatDefaultTimezone(date: Date, format = 'DD/MM/YYYY HH:mm:ss') {
    const currentTime = momentZone(date);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return currentTime.tz(timeZone).format(format);
  }

  /**
   * 1. date to the zone
   * @param date
   * @param timezone
   */
  public static dateToTimezoneDate(date: Date, timezone: string): momentZone.Moment {
    return momentZone(date).tz(timezone);
  }
}
