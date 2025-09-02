import { Pipe, PipeTransform } from '@angular/core';
import { EventStatus } from 'src/app/core/store/models/ft30/ft-enums';

@Pipe({
    name: 'eventStatusPipe',
    standalone: false
})
export class EventStatusPipe implements PipeTransform {
  transform(value: EventStatus) {
    switch (value) {
      case EventStatus.JustMeasurementNotAnEvent:
        return '';
      case EventStatus.EventButNotAnAccident:
        return '';
      case EventStatus.NotImportant:
        return 'i18n.ft.not-important';
      case EventStatus.Planned:
        return 'i18n.ft.planned';
      case EventStatus.NotConfirmed:
        return 'i18n.ft.not-confirmed';
      case EventStatus.Unprocessed:
        return 'i18n.ft.unporcessed';
      case EventStatus.Suspended:
        return 'i18n.ft.suspended';
      case EventStatus.Confirmed:
        return 'i18n.ft.confirmed';
    }
  }
}
