import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { ReportingComponent } from './reporting/reporting.component';
import { ReportingRoutingModule } from './reporting-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SystemEventsComponent } from './system-events/components/system-events/system-events.component';
import { OnDemandHistoryComponent } from './on-demand-history/components/on-demand-history/on-demand-history.component';
import { OnDemandMeasurementSettingsInfoComponent } from './on-demand-history/components/on-demand-measurement-settings-info/on-demand-measurement-settings-info.component';
import { CompletedOnDemandComponent } from './on-demand-history/components/completed-on-demand/completed-on-demand.component';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { MonitoringHistoryComponent } from './monitoring-history/components/monitoring-history/monitoring-history.component';
import { MonitoringResultComponent } from './monitoring-history/components/monitoring-result/monitoring-result.component';
import { MonitoringHistoryFilterComponent } from './monitoring-history/components/monitoring-history-filter/monitoring-history-filter.component';
import { PortsFilterComponent } from './monitoring-history/components/monitoring-history-filter/components/ports-filter/ports-filter.component';
import { MonitoringChangeDetailsComponent } from './monitoring-history/components/monitoring-change-details/monitoring-change-details.component';
import { MonitoringChangeValueComponent } from './monitoring-history/components/monitoring-change-value/monitoring-change-value.component';
import { AlarmEventsComponent } from './alarms/alarm-events/alarm-events.component';
import { AllAlarmsComponent } from './alarms/all-alarms/all-alarms.component';
import { MeasurementModule } from '../shared/measurement/measurement.module';
import { AlarmViewComponent } from './alarms/alarm-view/alarm-view.component';
import { AlarmsComponent } from './alarms/alarms.component';
import { AlarmsGroupToggleComponent } from './alarms/alarms-group-toggle/alarms-group-toggle.component';
import { BaselineHistoryComponent } from './baseline-history/baseline-history.component';
import { BaselineViewComponent } from './baseline-history/baseline-view/baseline-view.component';
import { NoDataOrLoadMoreComponent } from './shared/no-data-or-load-more/no-data-or-load-more.component';
import { InverseCdkScrollOffsetDirective } from './shared/inverse-rendered-offset.directive';

@NgModule({
  imports: [
    ReportingRoutingModule,
    SharedModule,
    MeasurementModule,
    FiberizerCoreModule,
    ScrollingModule,
    TranslateModule.forChild()
  ],
  exports: [],
  declarations: [
    ReportingComponent,
    SystemEventsComponent,
    OnDemandHistoryComponent,
    MonitoringHistoryComponent,
    MonitoringResultComponent,
    OnDemandMeasurementSettingsInfoComponent,
    CompletedOnDemandComponent,
    MonitoringHistoryFilterComponent,
    MonitoringChangeDetailsComponent,
    MonitoringChangeValueComponent,
    PortsFilterComponent,
    AlarmEventsComponent,
    AllAlarmsComponent,
    AlarmViewComponent,
    AlarmsComponent,
    AlarmsGroupToggleComponent,
    BaselineHistoryComponent,
    BaselineViewComponent,
    NoDataOrLoadMoreComponent,
    InverseCdkScrollOffsetDirective
  ],
  providers: []
})
export class ReportingModule {}
