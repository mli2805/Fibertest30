import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PickDateRange } from '../pick-date-range';
import { RtuDateTimePipe } from '../../../pipes/datetime.pipe';
import { DatePickTimeFormatPipe } from '../date-pick-timeformat.pipe';
import { AppTimezone } from '../../../../core/store/models';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppDateTimeLanguageFormat, AppLanguage, AppState, SettingsSelectors } from 'src/app/core';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { TimezoneUtils } from 'src/app/core/timezone.utils';

@Component({
  selector: 'rtu-date-pick-search-absolute-range',
  templateUrl: './date-pick-search-absolute-range.component.html',
  providers: [RtuDateTimePipe, DatePickTimeFormatPipe],
  standalone: false
})
export class DatePickSearchAbsoluteRangeComponent implements OnInit, OnDestroy {
  @Output() public ifDatePickOpenState = new EventEmitter<boolean>();

  @Input() public dateValue?: PickDateRange;

  @Output() public dateChanged = new EventEmitter<PickDateRange>();

  public fromDateStr = '';
  public toDateStr = '';
  public fromDate: Date | null = null;
  public toDate: Date | null = null;
  public timezone?: AppTimezone;
  private dateTimeLanguageFormat!: AppDateTimeLanguageFormat;
  private selectSettings: Subscription;
  private language?: AppLanguage;
  public disableApplyBtn = false;
  public fromCheckResult?: string;
  public toCheckResult?: string;

  constructor(
    private store: Store<AppState>,
    public rtuDateTime: RtuDateTimePipe,
    public datePickReformatPipe: DatePickTimeFormatPipe,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.selectSettings = this.store
      .select(SettingsSelectors.selectSettings)
      .subscribe(({ language }) => {
        this.language = language;
        this.dateAdapter.setLocale(language);
      });
    this.timezone = TimezoneUtils.getAppTimezoneFromBrowser();
  }

  ngOnInit(): void {
    if (this.dateValue) {
      // format to serve timezone
      this.fromDateStr = DatePickTimeFormatPipe.format(
        this.dateValue.fromDate,
        <string>this.timezone?.ianaId
      );
      this.toDateStr = DatePickTimeFormatPipe.format(
        this.dateValue.toDate,
        <string>this.timezone?.ianaId
      );
      this.fromDate = this.dateValue.fromDate;
      this.toDate = this.dateValue.toDate;
    }
  }

  public onStartDateChanged(date: Date) {
    date.setHours(0, 0, 0, 0);
    this.fromDate = date;
    this.fromDateStr = DatePickTimeFormatPipe.formatDefaultTimezone(date);
    this.tryParseDate();
  }

  public onEndDateChanged(date: Date) {
    date.setHours(23, 59, 59, 999);
    this.toDate = date;
    this.toDateStr = DatePickTimeFormatPipe.formatDefaultTimezone(date);
    this.tryParseDate();
  }

  public applyDateRange() {
    this.fromDate = DatePickTimeFormatPipe.parse(this.fromDateStr, <string>this.timezone?.ianaId);
    this.toDate = DatePickTimeFormatPipe.parse(this.toDateStr, <string>this.timezone?.ianaId);
    const pickDateRange = new PickDateRange(
      `${this.fromDateStr} - ${this.toDateStr}`,
      this.fromDate || new Date(),
      this.toDate || new Date(),
      false
    );
    this.dateChanged.emit(pickDateRange);
  }

  public onDatePickOpenState(ifDatePickOpenState: boolean) {
    this.ifDatePickOpenState.emit(ifDatePickOpenState);
  }

  public tryParseDate() {
    const startDateResult = this.checkStartDate();
    const endDateResult = this.checkEndDate();
    if (startDateResult || endDateResult) {
      this.disableApplyBtn = true;
      return;
    }
    // end > start
    const parsedStartDate = DatePickTimeFormatPipe.parse(
      this.fromDateStr,
      <string>this.timezone?.ianaId
    );
    const parsedEndDate = DatePickTimeFormatPipe.parse(
      this.toDateStr,
      <string>this.timezone?.ianaId
    );
    this.disableApplyBtn = parsedStartDate.getTime() >= parsedEndDate.getTime();
    if (this.disableApplyBtn) {
      this.fromCheckResult = 'i18n.date-piker.search-absolute-range.tips-from-error';
      this.toCheckResult = 'i18n.date-piker.search-absolute-range.tips-to-error';
    }
  }

  public checkStartDate(): boolean {
    let result = false;
    const parsedStartDate = DatePickTimeFormatPipe.parse(
      this.fromDateStr,
      <string>this.timezone?.ianaId
    );
    result = parsedStartDate.toString() === 'Invalid Date';
    if (result) {
      this.fromCheckResult = 'i18n.date-piker.search-absolute-range.tips-invalid-format';
    } else {
      this.fromCheckResult = undefined;
    }
    return result;
  }
  public checkEndDate(): boolean {
    let result = false;
    const parsedStartDate = DatePickTimeFormatPipe.parse(
      this.toDateStr,
      <string>this.timezone?.ianaId
    );
    result = parsedStartDate.toString() === 'Invalid Date';
    if (result) {
      this.toCheckResult = 'i18n.date-piker.search-absolute-range.tips-invalid-format';
    } else {
      this.toCheckResult = undefined;
    }
    return result;
  }
  ngOnDestroy() {
    this.selectSettings.unsubscribe();
  }
}
