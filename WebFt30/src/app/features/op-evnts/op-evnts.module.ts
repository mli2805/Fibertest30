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
import { RftsEventsWindowComponent } from './optical-event-view/rfts-events-window/rfts-events-window.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RftsEventsLevelComponent } from './optical-event-view/rfts-events-window/rfts-events-level/rfts-events-level.component';
import { ThresholdComponent } from './optical-event-view/rfts-events-window/rfts-events-level/threshold/threshold.component';
import { AccidentSchemeComponent } from './optical-event-view/trace-state/accident-scheme/accident-scheme.component';

@NgModule({
  imports: [OpEvntsRoutingModule, DragDropModule, SharedModule, FiberizerCoreModule, GisModule],
  exports: [RftsEventsWindowComponent],
  declarations: [
    OpEvntsComponent,
    OpticalEventsComponent,
    OpticalEventViewComponent,
    TraceStateComponent,
    TraceGisComponent,
    RftsEventsWindowComponent,
    RftsEventsLevelComponent,
    ThresholdComponent,
    AccidentSchemeComponent
  ],
  providers: []
})
export class OpEvntsModule {}
