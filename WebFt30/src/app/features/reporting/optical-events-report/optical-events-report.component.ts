import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, ReportingActions } from 'src/app/core';
import { EventStatus, FiberState } from 'src/app/core/store/models/ft30/ft-enums';
import { TimezoneUtils } from 'src/app/core/timezone.utils';
import { DateRangeUtils } from 'src/app/shared/components/date-pick/daterange-utils';
import { PickDateRange } from 'src/app/shared/components/date-pick/pick-date-range';
import { EventStatusPipe } from 'src/app/shared/pipes/event-status.pipe';
import { FiberStatePipe } from 'src/app/shared/pipes/fiberstate.pipe';
import { DateTimeRange } from 'src/grpc-generated';
import { Timestamp } from 'src/grpc-generated/google/protobuf/timestamp';

interface Ies {
  eventStatus: EventStatus;
  title: string;
  isChecked: boolean;
}

interface Ifs {
  state: FiberState;
  title: string;
  isChecked: boolean;
}
@Component({
  selector: 'rtu-optical-events-report',
  templateUrl: './optical-events-report.component.html',
  standalone: false
})
export class OpticalEventsReportComponent implements OnInit {
  private store: Store<AppState> = inject(Store<AppState>);

  buttons = [
    { id: 0, isSelected: false, title: 'i18n.ft.current-optical-events' },
    { id: 1, isSelected: true, title: 'i18n.ft.optical-events-for-the-period' }
  ];

  isCurrentEvents = this.buttons[0].isSelected;

  dateRange?: PickDateRange;

  statuses!: Ies[];
  states!: Ifs[];

  isDetailed = true;
  isShowPlace = false;

  ngOnInit(): void {
    this.dateRange = DateRangeUtils.convertToDateRange(
      'i18n.date-piker.search-this-year',
      TimezoneUtils.getAppTimezoneFromBrowser()
    );

    const pipeEs = new EventStatusPipe();
    this.statuses = Object.values(EventStatus)
      .filter((v) => typeof v === 'number') // отсекаем строковые ключи enum
      .filter((v) => pipeEs.transform(v as EventStatus) !== '')
      .map((v) => ({
        eventStatus: v as EventStatus,
        title: pipeEs.transform(v)!,
        isChecked: true
      }));

    const pipeFs = new FiberStatePipe();
    this.states = [
      {
        state: FiberState.FiberBreak,
        title: pipeFs.transform(FiberState.FiberBreak),
        isChecked: true
      },
      { state: FiberState.NoFiber, title: pipeFs.transform(FiberState.NoFiber), isChecked: true },
      { state: FiberState.Critical, title: pipeFs.transform(FiberState.Critical), isChecked: true },
      { state: FiberState.Major, title: pipeFs.transform(FiberState.Major), isChecked: true },
      { state: FiberState.Minor, title: pipeFs.transform(FiberState.Minor), isChecked: true },
      { state: FiberState.User, title: pipeFs.transform(FiberState.User), isChecked: false }
    ];
  }

  onRadioButtonClick(id: number) {
    this.buttons.forEach((b) => {
      b.isSelected = b.id === id;
    });
    this.isCurrentEvents = this.buttons[0].isSelected;
  }

  dateChange(dateRange: PickDateRange) {
    this.dateRange = dateRange;
  }

  onItemChanged(item: Ies | Ifs) {
    item.isChecked = !item.isChecked;
  }

  toggleDetailed() {
    this.isDetailed = !this.isDetailed;
    if (!this.isDetailed) {
      this.isShowPlace = false;
    }
  }

  toggleShowPlace() {
    this.isShowPlace = !this.isShowPlace;
  }

  onCreateReport() {
    const dateTimeRange = DateTimeRange.create();
    dateTimeRange.start = Timestamp.fromDate(this.dateRange!.fromDate);
    dateTimeRange.end = Timestamp.fromDate(this.dateRange!.toDate);
    this.store.dispatch(
      ReportingActions.getOpticalEventsReportPdf({
        isCurrentEvents: this.isCurrentEvents,
        searchWindow: dateTimeRange,
        eventStatuses: this.statuses.filter((s) => s.isChecked).map((e) => e.eventStatus),
        traceStates: this.states.filter((s) => s.isChecked).map((t) => t.state),
        isDetailed: this.isDetailed,
        isShowPlace: this.isShowPlace
      })
    );
  }
}
