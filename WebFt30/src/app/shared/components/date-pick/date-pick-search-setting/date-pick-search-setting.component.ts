import { Component, Input } from '@angular/core';
import { PickDateRange } from '../pick-date-range';

@Component({
  selector: 'rtu-date-pick-search-setting',
  templateUrl: './date-pick-search-setting.component.html',
  standalone: false
})
export class DatePickSearchSettingComponent {
  @Input() public dateValue?: PickDateRange;
  public get timezone(): string {
    return <string>this.dateValue?.appTimezone?.displayBaseUtcOffset;
  }
}
