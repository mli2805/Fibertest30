import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StsEvntsComponent } from './sts-evnts/sts-evnts.component';
import { StatusEventsComponent } from './status-events/status-events.component';

export const routes: Routes = [
  {
    path: '',
    component: StsEvntsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'status-events'
      },
      {
        path: 'status-events',
        pathMatch: 'full',
        component: StatusEventsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StsEvntsRoutingsModule {}
