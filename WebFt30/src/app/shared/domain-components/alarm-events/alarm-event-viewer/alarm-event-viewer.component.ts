import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  MonitoringAlarmEvent,
  MonitoringAlarmLevel,
  MonitoringAlarmStatus
} from 'src/app/core/store/models';

@Component({
  selector: 'rtu-alarm-event-viewer',
  templateUrl: 'alarm-event-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmEventViewerComponent {
  levels = MonitoringAlarmLevel;
  statuses = MonitoringAlarmStatus;

  @Input() alarmEvent!: MonitoringAlarmEvent;
}
