import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventTablesComponent } from './event-tables.component';
import { SystemEventsComponent } from './system-events/system-events.component';
import { OpticalEventsComponent } from './optical-events/optical-events.component';
import { NewtorkEventsComponent } from './newtork-events/newtork-events.component';
import { BopNetworkEventsComponent } from './bop-network-events/bop-network-events.component';
import { RtuStatusEventsComponent } from './rtu-status-events/rtu-status-events.component';

export const routes: Routes = [
  {
    path: '',
    component: EventTablesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'optical-events'
      },
      { path: 'optical-events', pathMatch: 'full', component: OpticalEventsComponent },
      { path: 'network-events', pathMatch: 'full', component: NewtorkEventsComponent },
      { path: 'bop-network-events', pathMatch: 'full', component: BopNetworkEventsComponent },
      { path: 'rtu-status-events', pathMatch: 'full', component: RtuStatusEventsComponent },
      {
        path: 'system-events',
        pathMatch: 'full',
        component: SystemEventsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventTablesRoutingModule {}