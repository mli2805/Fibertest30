import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

/** @title Date range picker forms integration */
@Component({
  selector: 'rtu-date-pick-range',
  templateUrl: './date-pick-range.component.html',
  standalone: false
})
export class DatePickRangeComponent {
  @Output() public ifOpenState = new EventEmitter<boolean>();

  @Output() public dateChanged = new EventEmitter<Date>();

  @Input() public date: Date | null = null;

  dateChange(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    if (date) {
      this.dateChanged.emit(date);
    }
  }

  public onOpened() {
    this.ifOpenState.emit(true);
  }

  public onClosed() {
    this.ifOpenState.emit(false);
  }
}
