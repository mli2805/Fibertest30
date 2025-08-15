import { Component, Input, OnDestroy } from '@angular/core';
import { PickDateRange } from '../pick-date-range';
import { Store } from '@ngrx/store';
import { AppDateTimeLanguageFormat, AppState, SettingsSelectors } from 'src/app/core';
import { Subscription } from 'rxjs';
import { AppTimezone } from 'src/app/core/store/models';

@Component({
  selector: 'rtu-date-pick-tip',
  templateUrl: './date-pick-tip.component.html',
  standalone: false
})
export class DatePickTipComponent {
  @Input() dateValue!: PickDateRange;

  public timezone?: AppTimezone;
  private dateTimeLanguageFormat!: AppDateTimeLanguageFormat;

  constructor(private store: Store<AppState>) {}
}
