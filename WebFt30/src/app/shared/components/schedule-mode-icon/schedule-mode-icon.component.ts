import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MonitoringSchedulerMode } from 'src/grpc-generated';

@Component({
  selector: 'rtu-schedule-mode-icon',
  templateUrl: 'schedule-mode-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `
  ]
})
export class ScheduleModeIconComponent {
  monitoringSchedulerMode = MonitoringSchedulerMode;

  @Input() mode!: MonitoringSchedulerMode;
}
