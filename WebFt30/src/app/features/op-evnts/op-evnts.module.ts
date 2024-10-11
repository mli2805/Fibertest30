import { NgModule } from '@angular/core';
import { OpEvntsRoutingModule } from './op-evnts-routings';
import { OpEvntsComponent } from './op-evnts/op-evnts.component';
import { OpticalEventsComponent } from './optical-events/optical-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OpticalEventViewComponent } from './optical-event-view/optical-event-view.component';

@NgModule({
  imports: [OpEvntsRoutingModule, SharedModule],
  exports: [],
  declarations: [OpEvntsComponent, OpticalEventsComponent, OpticalEventViewComponent],
  providers: []
})
export class OpEvntsModule {}
