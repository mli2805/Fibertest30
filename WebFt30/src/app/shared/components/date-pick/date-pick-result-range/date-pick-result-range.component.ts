import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PickDateRange } from '../pick-date-range';
import { ConnectedPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'rtu-date-pick-result-range',
  templateUrl: './date-pick-result-range.component.html',
  standalone: false
})
export class DatePickResultRangeComponent {
  @Output() public ifOpen = new EventEmitter<boolean>();
  @Input() public dateValue?: PickDateRange;
  @Input() public parentOpenState?: boolean;

  public ifOpenState = false;
  overlayPositions: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top'
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top'
    }
  ];

  onTriggerClick() {
    this.ifOpen.emit();
  }
  toggleDropdown() {
    if (this.dateValue && !this.parentOpenState) {
      this.ifOpenState = !this.ifOpenState;
    }
  }

  toggleDropClose() {
    this.ifOpenState = false;
  }
}
