import { AppTimezone } from 'src/app/core/store/models/app-time-zone';
import { DatePickTimeFormatPipe } from './date-pick-timeformat.pipe';
import { PickDateRange } from './pick-date-range';

export class DateRangeUtils {
  static convertToDateRange(label: string, appTimezone?: AppTimezone): PickDateRange {
    let result: PickDateRange;
    const currentDate = DatePickTimeFormatPipe.dateToTimezoneDate(
      new Date(),
      <string>appTimezone?.ianaId
    );
    let lastDay = null;
    let startTime;
    let startOfYesterday;
    let endOfYesterday;
    let startOfTime;
    let endOfTime;

    switch (label) {
      case 'i18n.date-piker.search-last-one-hour':
        startTime = currentDate.clone().subtract(1, 'hours');
        result = {
          label: label,
          fromDate: startTime.toDate(),
          toDate: currentDate.toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-4-hours':
        startTime = currentDate.clone().subtract(4, 'hours');
        result = {
          label: label,
          fromDate: startTime.clone().toDate(),
          toDate: currentDate.toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-8-hours':
        startTime = currentDate.clone().subtract(8, 'hours');
        result = {
          label: label,
          fromDate: startTime.toDate(),
          toDate: currentDate.toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-12-hours':
        startTime = currentDate.clone().subtract(12, 'hours');
        result = {
          label: label,
          fromDate: startTime.toDate(),
          toDate: currentDate.toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-24-hours':
        startTime = currentDate.clone().subtract(24, 'hours');
        result = {
          label: label,
          fromDate: startTime.toDate(),
          toDate: currentDate.toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-yesterday':
        startOfYesterday = currentDate.clone().subtract(1, 'days').startOf('day');
        endOfYesterday = currentDate.clone().subtract(1, 'days').endOf('day');
        result = {
          label,
          fromDate: startOfYesterday.toDate(),
          toDate: endOfYesterday.toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-monday':
        lastDay = this.computeLastDay(currentDate, 1);
        result = {
          label,
          fromDate: lastDay.clone().startOf('day').toDate(),
          toDate: lastDay.clone().endOf('day').toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-tuesday':
        lastDay = this.computeLastDay(currentDate, 2);
        result = {
          label,
          fromDate: lastDay.clone().startOf('day').toDate(),
          toDate: lastDay.clone().endOf('day').toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-wednesday':
        lastDay = this.computeLastDay(currentDate, 3);
        result = {
          label,
          fromDate: lastDay.clone().startOf('day').toDate(),
          toDate: lastDay.clone().endOf('day').toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-thursday':
        lastDay = this.computeLastDay(currentDate, 4);
        result = {
          label,
          fromDate: lastDay.clone().startOf('day').toDate(),
          toDate: lastDay.clone().endOf('day').toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-friday':
        // 找到上一个星期五的日期
        lastDay = this.computeLastDay(currentDate, 5);
        result = {
          label,
          fromDate: lastDay.clone().startOf('day').toDate(),
          toDate: lastDay.clone().endOf('day').toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-saturday':
        lastDay = this.computeLastDay(currentDate, 6);
        result = {
          label,
          fromDate: lastDay.clone().startOf('day').toDate(),
          toDate: lastDay.clone().endOf('day').toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-last-sunday':
        lastDay = this.computeLastDay(currentDate, 0);
        result = {
          label,
          fromDate: lastDay.clone().startOf('day').toDate(),
          toDate: lastDay.clone().endOf('day').toDate(),
          isQuick: true,
          appTimezone
        };
        break;
      case 'i18n.date-piker.search-this-week':
        startOfTime = currentDate.clone().startOf('isoWeek').toDate();
        endOfTime = currentDate.clone().endOf('isoWeek').toDate();
        result = { label, fromDate: startOfTime, toDate: endOfTime, isQuick: true, appTimezone };
        break;
      case 'i18n.date-piker.search-previous-week':
        startOfTime = currentDate.clone().subtract(1, 'weeks').startOf('isoWeek').toDate();
        endOfTime = currentDate.clone().subtract(1, 'weeks').endOf('isoWeek').toDate();
        result = { label, fromDate: startOfTime, toDate: endOfTime, isQuick: true, appTimezone };
        break;
      case 'i18n.date-piker.search-this-month':
        startOfTime = currentDate.clone().startOf('month').toDate();
        endOfTime = currentDate.clone().endOf('month').toDate();
        result = { label, fromDate: startOfTime, toDate: endOfTime, isQuick: true, appTimezone };
        break;
      case 'i18n.date-piker.search-previous-month':
        startOfTime = currentDate.clone().subtract(1, 'months').startOf('month').toDate();
        endOfTime = currentDate.clone().subtract(1, 'months').endOf('month').toDate();
        result = { label, fromDate: startOfTime, toDate: endOfTime, isQuick: true, appTimezone };
        break;
      case 'i18n.date-piker.search-last-7-days':
        startOfTime = currentDate.clone().subtract(6, 'days').startOf('day').toDate();
        endOfTime = currentDate.clone().endOf('day').toDate();
        result = { label, fromDate: startOfTime, toDate: endOfTime, isQuick: true, appTimezone };
        break;
      case 'i18n.date-piker.search-last-30-days':
      default:
        startOfTime = currentDate.clone().subtract(29, 'days').startOf('day').toDate();
        endOfTime = currentDate.clone().endOf('day').toDate();
        result = { label, fromDate: startOfTime, toDate: endOfTime, isQuick: true, appTimezone };
    }
    return result;
  }

  private static computeLastDay(currentDate: moment.Moment, indexOfDay: number): moment.Moment {
    const lastDay = currentDate.clone();
    while (lastDay.day() !== indexOfDay) {
      lastDay.subtract(1, 'day');
    }
    return lastDay;
  }
}
