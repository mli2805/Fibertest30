import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rtu-double-range-slider',
  templateUrl: 'double-range-slider.component.html',
  styleUrls: ['double-range-slider.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoubleRangeSliderComponent {
  @Input() min!: number;
  @Input() max!: number;
  @Input() step!: number;
  @Input() minRange!: number;

  @Input() minValue!: number;
  @Input() maxValue!: number;

  @Output() minValueChanged = new EventEmitter<number>();
  @Output() maxValueChanged = new EventEmitter<number>();

  get distancePercent(): number {
    const minMaxDelta = this.max - this.min;
    if (minMaxDelta === 0) {
      return 0;
    }
    const percent = (100 * (this.maxValue - this.minValue)) / minMaxDelta;
    return percent;
  }

  get distanceStartPercent(): number {
    const minMadDelta = this.max - this.min;
    if (minMadDelta === 0) {
      return 0;
    }
    return (100 * this.minValue) / minMadDelta;
  }

  onMinChange(event: any) {
    const newValue = Math.min(event.target.value, this.maxValue - this.minRange);
    event.target.value = newValue;

    if (this.minValue !== newValue) {
      this.minValueChanged.emit(newValue);
    }
  }

  onMaxChange(event: any) {
    const newValue = Math.max(event.target.value, this.minValue + this.minRange);
    event.target.value = newValue;

    if (this.maxValue !== newValue) {
      this.maxValueChanged.emit(newValue);
    }
  }
}
