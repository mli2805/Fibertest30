import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, ReportingActions } from 'src/app/core';

@Component({
  selector: 'rtu-monitoring-system-report',
  templateUrl: './monitoring-system-report.component.html',
  standalone: false
})
export class MonitoringSystemReportComponent {
  private store: Store<AppState> = inject(Store<AppState>);

  onCreateReport() {
    this.store.dispatch(ReportingActions.getMonitoringSystemReportPdf());
  }
}
