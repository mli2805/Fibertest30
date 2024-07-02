import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MonitoringAlarmLevel } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-monitoring-change-status',
  templateUrl: 'monitoirng-change-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringChangeStatusComponent {
  levels = MonitoringAlarmLevel;

  @Input() mostServerChangeLevel!: MonitoringAlarmLevel | null;
  @Input() changesCount!: number;
}
