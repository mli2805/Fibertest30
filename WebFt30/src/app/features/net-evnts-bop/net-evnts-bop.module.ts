import { NgModule } from '@angular/core';
import { NetEvntsBopRoutingModule } from './net-evnts-bop-routing';
import { NetEvntsBopComponent } from './net-evnts-bop/net-evnts-bop.component';
import { BopNetworkEventsComponent } from './bop-network-events/bop-network-events.component';

@NgModule({
  imports: [NetEvntsBopRoutingModule],
  exports: [],
  declarations: [NetEvntsBopComponent, BopNetworkEventsComponent],
  providers: []
})
export class NetEvntsBopModule {}
