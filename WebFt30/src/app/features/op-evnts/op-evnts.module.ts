import { NgModule } from '@angular/core';
import { OpEvntsRoutingModule } from './op-evnts-routings';
import { OpEvntsComponent } from './op-evnts/op-evnts.component';
import { OpticalEventsComponent } from './optical-events/optical-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OpticalEventViewComponent } from './optical-event-view/optical-event-view.component';
import { FiberizerCoreModule } from '../fiberizer-core/fiberizer-core.module';
import { TraceInfoComponent } from './optical-event-view/trace-info/trace-info.component';
import { GisModule } from '../gis/gis.module';

@NgModule({
  imports: [OpEvntsRoutingModule, SharedModule, FiberizerCoreModule, GisModule],
  exports: [],
  declarations: [
    OpEvntsComponent,
    OpticalEventsComponent,
    OpticalEventViewComponent,
    TraceInfoComponent
  ],
  providers: []
})
export class OpEvntsModule {}
