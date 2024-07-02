import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportingComponent } from './reporting/reporting.component';
import { SystemEventsComponent } from './system-events/components/system-events/system-events.component';
import { OnDemandHistoryComponent } from './on-demand-history/components/on-demand-history/on-demand-history.component';
import { CompletedOnDemandComponent } from './on-demand-history/components/completed-on-demand/completed-on-demand.component';
import { MonitoringHistoryComponent } from './monitoring-history/components/monitoring-history/monitoring-history.component';
import { MonitoringResultComponent } from './monitoring-history/components/monitoring-result/monitoring-result.component';
import { AlarmViewComponent } from './alarms/alarm-view/alarm-view.component';
import { AlarmsComponent } from './alarms/alarms.component';
import { BaselineHistoryComponent } from './baseline-history/baseline-history.component';
import { BaselineViewComponent } from './baseline-history/baseline-view/baseline-view.component';

export const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'alarms'
      },
      {
        path: 'alarms',
        pathMatch: 'full',
        component: AlarmsComponent
      },
      {
        path: 'alarms/:id',
        pathMatch: 'full',
        component: AlarmViewComponent,
        data: {
          navigateToParent: 1
        }
      },
      {
        path: 'system-events',
        pathMatch: 'full',
        component: SystemEventsComponent
      },
      {
        path: 'on-demand-history/:id',
        pathMatch: 'full',
        component: CompletedOnDemandComponent,
        data: {
          navigateToParent: 1
        }
      },
      {
        path: 'on-demand-history',
        pathMatch: 'full',
        component: OnDemandHistoryComponent
      },
      {
        path: 'monitoring-history/:id',
        pathMatch: 'full',
        component: MonitoringResultComponent,
        data: {
          navigateToParent: 1
        }
      },
      {
        path: 'monitoring-history',
        pathMatch: 'full',
        component: MonitoringHistoryComponent,
        data: {
          reuseRouteId: 'monitoring-history'
        }
      },
      {
        path: 'baseline-history/:id',
        pathMatch: 'full',
        component: BaselineViewComponent,
        data: {
          navigateToParent: 1
        }
      },
      {
        path: 'baseline-history',
        pathMatch: 'full',
        component: BaselineHistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule {}
