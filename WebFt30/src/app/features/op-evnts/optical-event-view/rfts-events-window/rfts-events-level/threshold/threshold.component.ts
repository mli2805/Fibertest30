import { Component, Input } from '@angular/core';
import { MonitoringThreshold } from 'src/app/core/store/models/ft30/rfts-events-dto';

@Component({
    selector: 'rtu-threshold',
    templateUrl: './threshold.component.html',
    standalone: false
})
export class ThresholdComponent {
  valueStr!: string;
  _threshold!: MonitoringThreshold | null;
  @Input() set threshold(value: MonitoringThreshold | null) {
    this._threshold = value;
    if (value !== null) {
      const val = value.value / 1000;
      this.valueStr = val.toFixed(3);
    }
  }
}
