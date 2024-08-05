import { NgModule } from '@angular/core';
import { MonitoringRoutingModule } from './monitoring-routing';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MonitoringPortsComponent } from './components/monitoring-ports/monitoring-ports.component';
import { ScheduleSelectComponent } from './components/schedule-select/schedule-select.component';
import { BaselineAutoSetupButtonComponent } from './components/baseline-auto-setup-button/baseline-auto-setup-button.component';
import { BaselineManualSetupIconComponent } from './components/baseline-manual-setup-icon/baseline-manual-setup-icon.component';
import { BaselineSetupComponent } from './components/baseline-setup/baseline-setup.component';
import { FiberizerCoreModule } from 'src/app/features/fiberizer-core/fiberizer-core.module';
import { MeasurementModule } from 'src/app/features/shared/measurement/measurement.module';
import { BaselineManualSetupButtonComponent } from './components/baseline-manual-setup-button/baseline-manual-setup-button.component';
import { QuickAnalysisComponent } from './components/quick-analysis/quick-analysis.component';
import { PortDashboardInfoComponent } from './components/port-dashboard-info/port-dashboard-info.component';

@NgModule({
  imports: [
    MonitoringRoutingModule,
    MeasurementModule,
    SharedModule,
    FiberizerCoreModule,
    DialogModule,
    TranslateModule.forChild()
  ],
  declarations: [
    MonitoringComponent,
    MonitoringPortsComponent,
    BaselineManualSetupIconComponent,
    ScheduleSelectComponent,
    BaselineAutoSetupButtonComponent,
    BaselineManualSetupButtonComponent,
    BaselineSetupComponent,
    QuickAnalysisComponent,
    PortDashboardInfoComponent
  ],
  exports: [ScheduleSelectComponent],
  providers: []
})
export class MonitoringModule {}
