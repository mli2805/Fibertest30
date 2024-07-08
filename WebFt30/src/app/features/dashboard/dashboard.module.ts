import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { TestQueueMonitorComponent } from './components/test-queue-monitor/test-queue-monitor.component';
import { ActiveAlarmsComponent } from './components/active-alarms/active-alarms.component';
import { QuickAnalysisComponent } from './components/quick-analysis/quick-analysis.component';
import { MeasurementModule } from '../shared/measurement/measurement.module';
import { RtuTreeComponent } from './components/rtu-tree/rtu-tree.component';
import { OneRtuComponent } from './components/rtu-tree/one-rtu/one-rtu.component';
import { AttachedTraceComponent } from './components/rtu-tree/attached-trace/attached-trace.component';
import { DetachedTraceComponent } from './components/rtu-tree/detached-trace/detached-trace.component';
import { FreePortComponent } from './components/rtu-tree/free-port/free-port.component';
import { OneBopComponent } from './components/rtu-tree/one-bop/one-bop.component';

@NgModule({
  imports: [DashboardRoutingModule, SharedModule, MeasurementModule],
  exports: [],
  declarations: [
    DashboardComponent,
    TestQueueMonitorComponent,
    ActiveAlarmsComponent,
    QuickAnalysisComponent,
    RtuTreeComponent,
    OneRtuComponent,
    AttachedTraceComponent,
    DetachedTraceComponent,
    FreePortComponent,
    OneBopComponent
  ],
  providers: []
})
export class DashboardModule {}
