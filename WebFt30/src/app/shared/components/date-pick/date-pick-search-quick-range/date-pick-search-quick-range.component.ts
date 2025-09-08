import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PickDateRange } from '../pick-date-range';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  AppDateTimeLanguageFormat,
  AppLanguage,
  AppState,
  SettingsSelectors
} from '../../../../core';
import { Subscription } from 'rxjs';
import { AppTimezone } from '../../../../core/store/models';
import { DateRangeUtils } from '../daterange-utils';
import { TimezoneUtils } from 'src/app/core/timezone.utils';

@Component({
  selector: 'rtu-date-pick-search-quick-range',
  templateUrl: './date-pick-search-quick-range.component.html',
  standalone: false
})
export class DatePickSearchQuickRangeComponent implements OnInit {
  public inputText = '';
  public allLabels = [
    { label: 'i18n.date-piker.search-last-one-hour', selected: false },
    { label: 'i18n.date-piker.search-last-4-hours', selected: false },
    { label: 'i18n.date-piker.search-last-8-hours', selected: false },
    { label: 'i18n.date-piker.search-last-12-hours', selected: false },
    { label: 'i18n.date-piker.search-last-24-hours', selected: false },
    { label: 'i18n.date-piker.search-yesterday', selected: false },
    { label: 'i18n.date-piker.search-last-monday', selected: false },
    { label: 'i18n.date-piker.search-last-tuesday', selected: false },
    { label: 'i18n.date-piker.search-last-wednesday', selected: false },
    { label: 'i18n.date-piker.search-last-thursday', selected: false },
    { label: 'i18n.date-piker.search-last-friday', selected: false },
    { label: 'i18n.date-piker.search-last-saturday', selected: false },
    { label: 'i18n.date-piker.search-last-sunday', selected: false },
    { label: 'i18n.date-piker.search-this-week', selected: false },
    { label: 'i18n.date-piker.search-previous-week', selected: false },
    { label: 'i18n.date-piker.search-this-month', selected: false },
    { label: 'i18n.date-piker.search-previous-month', selected: false },
    { label: 'i18n.date-piker.search-this-year', selected: false },
    { label: 'i18n.date-piker.search-previous-year', selected: false },
    { label: 'i18n.date-piker.search-last-7-days', selected: false },
    { label: 'i18n.date-piker.search-last-30-days', selected: false }
  ];

  public filterLabels: { label: string; selected: boolean }[] = [];

  @Output() public dateChanged = new EventEmitter<PickDateRange>();
  @Input() public dateValue?: PickDateRange;
  public timezone?: AppTimezone;
  private dateTimeLanguageFormat!: AppDateTimeLanguageFormat;
  constructor(private translate: TranslateService, private store: Store<AppState>) {
    this.filterLabels = [...this.allLabels];
    this.timezone = TimezoneUtils.getAppTimezoneFromBrowser();
  }

  ngOnInit() {
    if (this.dateValue) {
      const label = this.dateValue.label;
      this.allLabels.forEach((it) => {
        if (label == it.label) {
          it.selected = true;
        }
      });
    }
  }

  onInputChange(e: any) {
    this.filterLabels = this.allLabels.filter((it) => {
      const item = this.translate.instant(it.label);
      return item.toLocaleLowerCase().indexOf(this.inputText.toLocaleLowerCase() || '') >= 0;
    });
  }

  onSelectDate(item: { label: string; selected: boolean }) {
    this.filterLabels.forEach((it) => {
      it.selected = false;
      if (item.label == it.label) {
        it.selected = true;
      }
    });
    const dateRange = DateRangeUtils.convertToDateRange(item.label, this.timezone);
    this.dateChanged.emit(dateRange);
  }
}
