import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, ReportingActions, ReportingSelectors } from 'src/app/core';
import { LogOperationFilterComponent } from './log-operation-filter/log-operation-filter.component';
import { firstValueFrom } from 'rxjs';
import {
  ALL_LOG_OPERATION_CODES,
  LogOperationCode
} from 'src/app/core/store/models/ft30/user-action-line';
import { PickDateRange } from 'src/app/shared/components/date-pick/pick-date-range';
import moment from 'moment';
import { TimezoneUtils } from 'src/app/core/timezone.utils';
import { DateRangeUtils } from 'src/app/shared/components/date-pick/daterange-utils';

@Component({
  selector: 'rtu-user-actions-report',
  templateUrl: './user-actions-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActionsReportComponent implements OnInit {
  reportingActions = ReportingActions;
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(ReportingSelectors.selectLoading);
  errorMessageId$ = this.store.select(ReportingSelectors.selectErrorMessageId);
  lines$ = this.store.select(ReportingSelectors.selectUserActionLines);

  dateRange?: PickDateRange;
  selectedOperations!: LogOperationCode[];
  operationFilterFace!: string;

  constructor(private dialog: Dialog, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dateRange = DateRangeUtils.convertToDateRange(
      'i18n.date-piker.search-last-30-days',
      TimezoneUtils.getAppTimezoneFromBrowser()
    );

    this.selectedOperations = ALL_LOG_OPERATION_CODES;
    this.operationFilterFace = 'i18n.ft.no-filter';
    this.refresh();
  }

  refresh() {
    this.store.dispatch(ReportingActions.getUserActionLines());
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
  }
}
