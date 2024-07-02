import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ConvertUtils } from 'src/app/core/convert.utils';
import {
  MonitoringAlarmType,
  MonitoringChangeKeyEvent,
  QualifiedValue,
  ValueExactness
} from 'src/app/core/store/models';

@Component({
  selector: 'rtu-monitoring-change-value',
  templateUrl: 'monitoring-change-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonitoringChangeValueComponent implements OnInit {
  converterUtils = ConvertUtils;

  @Input() value!: QualifiedValue | number | null;
  @Input() showSing = false;

  simpleValue: number | null = null;
  qualifiedValue: QualifiedValue | null = null;

  ngOnInit(): void {
    if (this.value === null) {
      return;
    }

    if (this.value instanceof QualifiedValue) {
      if (this.value.exactness === ValueExactness.Exact) {
        this.simpleValue = this.value.value;
      } else {
        this.qualifiedValue = this.value;
      }
    } else {
      this.simpleValue = this.value;
    }
  }
}
