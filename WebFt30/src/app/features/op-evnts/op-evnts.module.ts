import { NgModule } from '@angular/core';
import { OpEvntsRoutingModule } from './op-evnts-routings';
import { OpEvntsComponent } from './op-evnts/op-evnts.component';
import { OpticalEventsComponent } from './optical-events/optical-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OpticalEventViewComponent } from './optical-event-view/optical-event-view.component';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { TraceStateComponent } from './optical-event-view/trace-state/trace-state.component';
import { GisModule } from '../gis/gis.module';
import { TraceGisComponent } from './optical-event-view/trace-gis/trace-gis.component';

@NgModule({
  imports: [OpEvntsRoutingModule, SharedModule, FiberizerCoreModule, GisModule],
  exports: [],
  declarations: [
    OpEvntsComponent,
    OpticalEventsComponent,
    OpticalEventViewComponent,
    TraceStateComponent,
    TraceGisComponent
  ],
  providers: []
})
export class OpEvntsModule {}
