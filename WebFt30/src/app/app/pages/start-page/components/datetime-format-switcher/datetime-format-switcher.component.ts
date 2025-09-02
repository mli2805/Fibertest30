import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  AppDateTimeFormats,
  AppDateTimeLanguageFormat,
  AppDateTimeLanguageFormats,
  AppState,
  SettingsActions,
  SettingsSelectors
} from 'src/app/core';

@Component({
    selector: 'rtu-datetime-format-switcher',
    templateUrl: 'datetime-format-switcher.component.html',
    standalone: false
})
export class DatetimeFormatSwitcherComponent {
  public store: Store<AppState> = inject(Store);

  public dateTimeFormats = <any>AppDateTimeLanguageFormats;
  public selectedDateTimeFormat$: Observable<AppDateTimeLanguageFormat>;

  currentDate = new Date();

  constructor() {
    this.selectedDateTimeFormat$ = this.store.select(SettingsSelectors.selectDateTimeFormat);
  }

  setDateTimeFormat(dateTimeFormat: AppDateTimeLanguageFormat) {
    this.store.dispatch(SettingsActions.changeDateTimeFormat({ dateTimeFormat }));
  }
}
