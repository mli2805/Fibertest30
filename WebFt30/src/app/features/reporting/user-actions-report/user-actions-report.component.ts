import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, ReportingActions, ReportingSelectors, User, UsersSelectors } from 'src/app/core';
import { LogOperationFilterComponent } from './log-operation-filter/log-operation-filter.component';
import { firstValueFrom } from 'rxjs';
import {
  ALL_LOG_OPERATION_CODES,
  LogOperationCode,
  UserActionLine
} from 'src/app/core/store/models/ft30/user-action-line';
import { PickDateRange } from 'src/app/shared/components/date-pick/pick-date-range';
import { TimezoneUtils } from 'src/app/core/timezone.utils';
import { DateRangeUtils } from 'src/app/shared/components/date-pick/daterange-utils';
import { CoreUtils } from 'src/app/core/core.utils';
import { GisMapUtils } from '../../gis/components/shared/gis-map.utils';
import { DateTimeRange } from 'src/grpc-generated';
import { Timestamp } from 'src/grpc-generated/google/protobuf/timestamp';
import { BaseRefType, EventStatus } from 'src/app/core/store/models/ft30/ft-enums';
import { TranslateService } from '@ngx-translate/core';
import { EventStatusPipe } from 'src/app/shared/pipes/event-status.pipe';
import { BaseRefTypePipe } from 'src/app/shared/pipes/base-ref-type.pipe';
import { ReturnCode } from 'src/app/core/store/models/ft30/return-code';
import { ReturnCodePipe } from 'src/app/shared/pipes/return-code.pipe';

interface UserFilterOption {
  title: string;
  id: string;
}
@Component({
  selector: 'rtu-user-actions-report',
  templateUrl: './user-actions-report.component.html',
  styles: [':host { overflow-y: auto; width: 100%; height: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActionsReportComponent implements OnInit {
  reportingActions = ReportingActions;
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(ReportingSelectors.selectLoading);
  errorMessageId$ = this.store.select(ReportingSelectors.selectErrorMessageId);
  lines$ = this.store.select(ReportingSelectors.selectUserActionLines);

  userFilterItems!: UserFilterOption[];
  selectedUser!: UserFilterOption;

  dateRange?: PickDateRange;
  selectedOperations!: LogOperationCode[];
  operationFilterFace!: string;

  constructor(
    private dialog: Dialog,
    private ts: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const users = CoreUtils.getCurrentState(this.store, UsersSelectors.selectUsersUsers);
    this.userFilterItems = [
      { title: 'i18n.ft.no-filter', id: GisMapUtils.emptyGuid },
      ...users.map((u) => ({ title: u.fullName, id: u.id }))
    ];
    this.selectedUser = this.userFilterItems[0];

    this.dateRange = DateRangeUtils.convertToDateRange(
      'i18n.date-piker.search-last-30-days',
      TimezoneUtils.getAppTimezoneFromBrowser()
    );

    this.selectedOperations = ALL_LOG_OPERATION_CODES;
    this.operationFilterFace = 'i18n.ft.no-filter';
    this.refresh();
  }

  getLocalizedAdditinalInfo(line: UserActionLine): string {
    try {
      switch (line.logOperationCode) {
        case LogOperationCode.MeasurementUpdated: {
          const statusEnum = EventStatus[line.operationParams as keyof typeof EventStatus];
          return new EventStatusPipe().transform(statusEnum);
        }
        case LogOperationCode.TraceAttached: {
          return this.ts.instant('i18n.ft.port') + ' ' + line.operationParams;
        }
        case LogOperationCode.MonitoringSettingsChanged: {
          return line.operationParams === 'False'
            ? 'i18n.ft.manual-mode'
            : 'i18n.ft.automatic-mode';
        }
        case LogOperationCode.BaseRefAssigned: {
          const bb = line.operationParams.split(';');
          const tt = bb.map((b) => BaseRefType[b as keyof typeof BaseRefType]);
          const pipe = new BaseRefTypePipe();
          const ss = tt.map((t) => this.ts.instant(pipe.transform(t)));
          return ss.join(';');
        }
        case LogOperationCode.ClientStarted: {
          const registrationResult = ReturnCode[line.operationParams as keyof typeof ReturnCode];
          return new ReturnCodePipe().transform(registrationResult);
        }
        case LogOperationCode.EventsAndSorsRemoved:
        case LogOperationCode.SnapshotMade: {
          return this.ts.instant('i18n.ft.up-to') + ' ' + line.operationParams;
        }
      }
    } catch (error) {
      console.log(error);
    }
    return line.operationParams;
  }

  refresh() {
    const dateTimeRange = DateTimeRange.create();
    dateTimeRange.start = Timestamp.fromDate(this.dateRange!.fromDate);
    dateTimeRange.end = Timestamp.fromDate(this.dateRange!.toDate);
    this.store.dispatch(
      ReportingActions.getUserActionLines({
        userId: this.selectedUser.id,
        searchWindow: dateTimeRange,
        operationCodes: this.selectedOperations
      })
    );
  }

  onUserFilterChanged(userFilter: UserFilterOption) {
    this.selectedUser = userFilter;
  }

  dateChange(dateRange: PickDateRange) {
    this.dateRange = dateRange;
    this.refresh();
  }

  async onLogOperationFilterClick() {
    const subscription = this.dialog.open(LogOperationFilterComponent, {
      maxHeight: '95vh',
      maxWidth: '95vw',
      minWidth: '25ch',
      disableClose: false,
      data: this.selectedOperations
    });

    const result = (await firstValueFrom(subscription.closed)) || false;
    if (!result) return; // пользователь отказался от выбора

    this.selectedOperations = <LogOperationCode[]>result;
    this.operationFilterFace =
      this.selectedOperations.length === ALL_LOG_OPERATION_CODES.length
        ? 'i18n.ft.no-filter'
        : 'i18n.ft.filter-applied';
    this.cdr.markForCheck();
    this.refresh();
  }

  downloadPdf() {
    const dateTimeRange = DateTimeRange.create();
    dateTimeRange.start = Timestamp.fromDate(this.dateRange!.fromDate);
    dateTimeRange.end = Timestamp.fromDate(this.dateRange!.toDate);
    this.store.dispatch(
      ReportingActions.getUserActionsPdf({
        userId: this.selectedUser.id,
        searchWindow: dateTimeRange,
        operationCodes: this.selectedOperations
      })
    );
  }
}
