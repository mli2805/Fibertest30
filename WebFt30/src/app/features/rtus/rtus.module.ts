import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { SharedModule } from 'src/app/shared/shared.module';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
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
import { OneChannelTestComponent } from './rtu-initialization/one-channel-test/one-channel-test.component';
import { FreePortMenuComponent } from './rtu-tree/free-port/free-port-menu/free-port-menu.component';
import { AttachedTraceMenuComponent } from './rtu-tree/attached-trace/attached-trace-menu/attached-trace-menu.component';
import { DetachedTraceMenuComponent } from './rtu-tree/detached-trace/detached-trace-menu/detached-trace-menu.component';
import { OneBopMenuComponent } from './rtu-tree/one-bop/one-bop-menu/one-bop-menu.component';
import { MeasurementClientComponent } from './measurement-client/measurement-client.component';
import { OtauMonitoringSettingsComponent } from './rtu-monitoring-settings/otau-monitoring-settings/otau-monitoring-settings.component';
import { TraceAssignBaseComponent } from './trace-assign-base/trace-assign-base.component';
import { TraceAttachComponent } from './trace-attach/trace-attach.component';
import { BopAttachComponent } from './bop-attach/bop-attach.component';

@NgModule({
  imports: [
    RtusRoutingModule,
    SharedModule,
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
    RtusComponent,
    OneChannelTestComponent,
    FreePortMenuComponent,
    AttachedTraceMenuComponent,
    DetachedTraceMenuComponent,
    OneBopMenuComponent,
    MeasurementClientComponent,
    OtauMonitoringSettingsComponent,
    TraceAssignBaseComponent,
    TraceAttachComponent,
    BopAttachComponent
  ],
  providers: []
})
export class RtusModule {}
