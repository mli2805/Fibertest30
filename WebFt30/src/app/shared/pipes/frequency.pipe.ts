import { Pipe, PipeTransform } from '@angular/core';
import { Frequency } from 'src/app/core/store/models/ft30/ft-enums';

@Pipe({
    name: 'frequencyPipe',
    standalone: false
})
export class FrequencyPipe implements PipeTransform {
  transform(value: Frequency) {
    switch (value) {
      case Frequency.Permanently:
        return 'i18n.ft.permanently';
      case Frequency.EveryHour:
        return 'i18n.ft.every-hour';
      case Frequency.Every6Hours:
        return 'i18n.ft.every-6-hours';
      case Frequency.Every12Hours:
        return 'i18n.ft.every-12-hours';
      case Frequency.EveryDay:
        return 'i18n.ft.every-day';
      case Frequency.Every2Days:
        return 'i18n.ft.every-2-days';
      case Frequency.Every7Days:
        return 'i18n.ft.every-7-days';
      case Frequency.Every30Days:
        return 'i18n.ft.every-30-days';
      case Frequency.DoNot:
        return 'i18n.ft.do-not';
    }
  }
}
