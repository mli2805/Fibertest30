import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { TestQueueMonitorComponent } from './components/test-queue-monitor/test-queue-monitor.component';
import { ActiveAlarmsComponent } from './components/active-alarms/active-alarms.component';
import { QuickAnalysisComponent } from './components/quick-analysis/quick-analysis.component';
import { MeasurementModule } from '../shared/measurement/measurement.module';
import { RtuTreeComponent } from './components/rtu-tree/rtu-tree.component';

@NgModule({
  imports: [DashboardRoutingModule, SharedModule, MeasurementModule],
  exports: [],
  declarations: [
    DashboardComponent,
    TestQueueMonitorComponent,
    ActiveAlarmsComponent,
    QuickAnalysisComponent,
    RtuTreeComponent
  ],
  providers: []
})
export class DashboardModule {}
