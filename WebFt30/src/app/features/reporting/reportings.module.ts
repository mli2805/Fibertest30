import { NgModule } from '@angular/core';
import { ReportingRoutingModule } from './reporting-routing';
import { ReportingComponent } from './reporting/reporting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { SystemEventsComponent } from './system-events/system-events.component';
import { UserActionsReportComponent } from './user-actions-report/user-actions-report.component';
import { MonitoringSystemReportComponent } from './monitoring-system-report/monitoring-system-report.component';
import { OpticalEventsReportComponent } from './optical-events-report/optical-events-report.component';
import { LogOperationFilterComponent } from './user-actions-report/log-operation-filter/log-operation-filter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReportingRoutingModule,
    SharedModule,
    FiberizerCoreModule,
    ScrollingModule,
    TranslateModule.forChild()
  ],
  exports: [],
  declarations: [
    ReportingComponent,
    SystemEventsComponent,
    UserActionsReportComponent,
    MonitoringSystemReportComponent,
    OpticalEventsReportComponent,
    LogOperationFilterComponent
  ],
  providers: []
})
export class Reporting {}
