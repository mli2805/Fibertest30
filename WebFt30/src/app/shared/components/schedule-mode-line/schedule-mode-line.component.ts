import { Component, Input } from '@angular/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { MonitoringSchedulerMode } from 'src/grpc-generated';

@Component({
  selector: 'rtu-schedule-mode-line',
  templateUrl: './schedule-mode-line.component.html'
})
export class ScheduleModeLineComponent {
  @Input() mode!: MonitoringSchedulerMode;
  @Input() interval!: any;
  @Input() slotsString!: string;

  convertUtils = ConvertUtils;
  monitoringScheduleMode = MonitoringSchedulerMode;
}
