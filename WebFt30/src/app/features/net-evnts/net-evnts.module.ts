import { NgModule } from '@angular/core';
import { NetEvntsComponent } from './net-evnts/net-evnts.component';
import { NewtorkEventsComponent } from './newtork-events/newtork-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NetEvntsRoutingModule } from './net-evnts-routings';

@NgModule({
  imports: [NetEvntsRoutingModule, SharedModule],
  exports: [],
  declarations: [NetEvntsComponent, NewtorkEventsComponent],
  providers: []
})
export class NetEvntsModule {}
