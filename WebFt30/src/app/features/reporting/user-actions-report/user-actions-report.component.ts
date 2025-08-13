import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, ReportingActions, ReportingSelectors } from 'src/app/core';

@Component({
  selector: 'rtu-user-actions-report',
  templateUrl: './user-actions-report.component.html'
})
export class UserActionsReportComponent implements OnInit {
  reportingActions = ReportingActions;
  private store: Store<AppState> = inject(Store<AppState>);

  loading$ = this.store.select(ReportingSelectors.selectLoading);
  errorMessageId$ = this.store.select(ReportingSelectors.selectErrorMessageId);
  lines$ = this.store.select(ReportingSelectors.selectUserActionLines);

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.store.dispatch(ReportingActions.getUserActionLines());
  }
}
