import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetEvntsComponent } from './net-evnts/net-evnts.component';
import { NewtorkEventsComponent } from './newtork-events/newtork-events.component';

export const routes: Routes = [
  {
    path: '',
    component: NetEvntsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'network-events'
      },
      {
        path: 'network-events',
        pathMatch: 'full',
        component: NewtorkEventsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetEvntsRoutingModule {}
