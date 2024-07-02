import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/core';

export const GROUP_BY_ALARM_ID = 'GroupByAlarmId';

@Component({
  selector: 'rtu-alarms',
  templateUrl: './alarms.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }']
})
export class AlarmsComponent {
  isAlarmsGroupedWithEvents = false;

  constructor(private localStorageService: LocalStorageService) {
    this.isAlarmsGroupedWithEvents = localStorageService.getItem(GROUP_BY_ALARM_ID) || false;
  }

  groupByAlarmId() {
    this.isAlarmsGroupedWithEvents = !this.isAlarmsGroupedWithEvents;
    this.localStorageService.setItem(GROUP_BY_ALARM_ID, this.isAlarmsGroupedWithEvents);
  }
}
