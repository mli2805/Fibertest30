import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from './reporting/reporting.component';
import { SystemEventsComponent } from './system-events/system-events.component';

export const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'system-events'
      },
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
export class ReportingRoutingModule {}
