import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetEvntsBopComponent } from './net-evnts-bop/net-evnts-bop.component';
import { BopNetworkEventsComponent } from './bop-network-events/bop-network-events.component';

export const routes: Routes = [
  {
    path: '',
    component: NetEvntsBopComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'network-events-bop'
      },
      {
        path: 'network-events-bop',
        pathMatch: 'full',
        component: BopNetworkEventsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetEvntsBopRoutingModule {}
