import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpEvntsComponent } from './op-evnts/op-evnts.component';
import { OpticalEventsComponent } from './optical-events/optical-events.component';
import { OpticalEventViewComponent } from './optical-event-view/optical-event-view.component';

export const routes: Routes = [
  {
    path: '',
    component: OpEvntsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'optical-events'
      },
      {
        path: 'optical-events',
        pathMatch: 'full',
        component: OpticalEventsComponent
      },
      {
        path: 'optical-events/:id',
        pathMatch: 'full',
        component: OpticalEventViewComponent,
        data: {
          navigateToParent: 1
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpEvntsRoutingModule {}
