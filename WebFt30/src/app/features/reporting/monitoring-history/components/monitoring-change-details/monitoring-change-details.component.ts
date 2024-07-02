import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import { MonitoringAlarmLevel, MonitoringChange } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-monitoring-changes-details',
  templateUrl: 'monitoring-change-details.component.html',
  styles: [':host { display: flex; flex-grow: 1; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringChangeDetailsComponent {
  levels = MonitoringAlarmLevel;
  converterUtils = ConvertUtils;

  @Input() changes: MonitoringChange[] = [];
  @Output() measurementClick = new EventEmitter<number>();
  @Output() baselineClick = new EventEmitter<number>();

  clickMeasurement(keyEventIndex: number) {
    this.measurementClick.emit(keyEventIndex);
  }

  clickBaseline(keyEventIndex: number) {
    this.baselineClick.emit(keyEventIndex);
  }
}
