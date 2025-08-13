import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from './reporting/reporting.component';
import { UserActionsReportComponent } from './user-actions-report/user-actions-report.component';
import { OpticalEventsReportComponent } from './optical-events-report/optical-events-report.component';
import { MonitoringSystemReportComponent } from './monitoring-system-report/monitoring-system-report.component';

export const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'monitoring-system-report'
      },
      {
        path: 'monitoring-system-report',
        pathMatch: 'full',
        component: MonitoringSystemReportComponent
      },
      {
        path: 'optical-events-report',
        pathMatch: 'full',
        component: OpticalEventsReportComponent
      },

      {
        path: 'user-actions-report',
        pathMatch: 'full',
        component: UserActionsReportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule {}
