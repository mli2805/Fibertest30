import { Component, Input } from '@angular/core';
import { Threshold } from '../../../../../../../core/store/models/threshold';

@Component({
  selector: 'rtu-threshold',
  templateUrl: './threshold.component.html'
})
export class ThresholdComponent {
  @Input() threshold!: Threshold;
}
