import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { PickDateRange } from './pick-date-range';
import { AppTimezone } from '../../../core/store/models';
import { Subscription } from 'rxjs';
import { AppState, SettingsSelectors } from '../../../core';
import { Store } from '@ngrx/store';
import { DateRangeUtils } from './daterange-utils';

/*
 * Introduced the @angular/material component, found that the UI style
 *  and our system does not match, it is cumbersome to adjust, so do not introduce
 * */
@Component({
    selector: 'rtu-date-pick',
    templateUrl: './date-pick.component.html',
    standalone: false
})
export class DatePickComponent implements OnInit, OnDestroy, OnChanges {
  @Output() public filterChanged = new EventEmitter<PickDateRange>();
  public ifOpenState = false;
  @Input() public dateValue?: PickDateRange;
  /**
   * Default quick selection time
   */
  @Input() public initDate = 'i18n.date-piker.search-last-24-hours';
  private ifDatePickOpenState?: boolean;
  // private dateFormatSubscription: Subscription;
  private timezone!: AppTimezone;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    if (!this.dateValue) {
      this.dateSelected(DateRangeUtils.convertToDateRange(this.initDate, this.timezone));
    }
  }

  reset() {
    this.dateSelected(DateRangeUtils.convertToDateRange(this.initDate, this.timezone));
  }

  @HostListener('dateValue')
  ngOnChanges(changes: SimpleChanges) {
    const changeValue = changes['dateValue']?.currentValue ?? null;
    if (changeValue?.isQuick && changeValue?.refresh) {
      this.dateSelected(DateRangeUtils.convertToDateRange(changeValue?.label, this.timezone));
    }
  }

  dateSelected(value: PickDateRange) {
    this.dateValue = value;
    this.ifOpenState = false;
    this.filterChanged.emit(value);
  }

  onIfOpen() {
    this.ifOpenState = !this.ifOpenState;
  }

  searchTriggerClicked(event: MouseEvent) {
    event.stopPropagation();
  }

  public onDatePickOpenState(ifDatePickOpenState: boolean) {
    this.ifDatePickOpenState = ifDatePickOpenState;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && !this.ifDatePickOpenState) {
      this.ifOpenState = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    // this.dateFormatSubscription.unsubscribe();
    console.log();
  }
}
