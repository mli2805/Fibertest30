import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { SharedModule } from 'src/app/shared/shared.module';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { MeasurementModule } from '../shared/measurement/measurement.module';
import { RtusRoutingModule } from './rtus-routing';

import { RtuTreeComponent } from './rtu-tree/rtu-tree.component';
import { OneRtuComponent } from './rtu-tree/one-rtu/one-rtu.component';
import { AttachedTraceComponent } from './rtu-tree/attached-trace/attached-trace.component';
import { FreePortComponent } from './rtu-tree/free-port/free-port.component';
import { DetachedTraceComponent } from './rtu-tree/detached-trace/detached-trace.component';
import { OneBopComponent } from './rtu-tree/one-bop/one-bop.component';
import { MonitoringModePictogramComponent } from './rtu-tree/pictograms/monitoring-mode-pictogram/monitoring-mode-pictogram.component';
import { RtuPartStatePictogramComponent } from './rtu-tree/pictograms/rtu-part-state-pictogram/rtu-part-state-pictogram.component';
import { TraceMonitoringModePictogramComponent } from './rtu-tree/pictograms/trace-monitoring-mode-pictogram/trace-monitoring-mode-pictogram.component';
import { FiberStatePictogramComponent } from './rtu-tree/pictograms/fiber-state-pictogram/fiber-state-pictogram.component';
import { TceLinkPictogramComponent } from './rtu-tree/pictograms/tce-link-pictogram/tce-link-pictogram.component';
import { RtuInitializationComponent } from './rtu-initialization/rtu-initialization.component';
import { OneRtuMenuComponent } from './rtu-tree/one-rtu/one-rtu-menu/one-rtu-menu.component';
import { RtuInformationComponent } from './rtu-information/rtu-information.component';
import { RtuStateComponent } from './rtu-state/rtu-state.component';
import { RtuMonitoringSettingsComponent } from './rtu-monitoring-settings/rtu-monitoring-settings.component';
import { RtuLandmarksComponent } from './rtu-landmarks/rtu-landmarks.component';
import { RtusComponent } from './rtus/rtus.component';

@NgModule({
  imports: [
    RtusRoutingModule,
    SharedModule,
    MeasurementModule,
    FiberizerCoreModule,
    ScrollingModule,
    TranslateModule.forChild()
  ],
  exports: [],
  declarations: [
    RtuTreeComponent,
    OneRtuComponent,
    AttachedTraceComponent,
    DetachedTraceComponent,
    FreePortComponent,
    OneBopComponent,
    MonitoringModePictogramComponent,
    RtuPartStatePictogramComponent,
    TraceMonitoringModePictogramComponent,
    FiberStatePictogramComponent,
    TceLinkPictogramComponent,
    RtuInitializationComponent,
    OneRtuMenuComponent,
    RtuInformationComponent,
    RtuStateComponent,
    RtuMonitoringSettingsComponent,
    RtuLandmarksComponent,
    RtusComponent
  ],
  providers: []
})
export class RtusModule {}
