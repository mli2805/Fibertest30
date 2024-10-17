import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvntsNewComponent } from './evnts-new/evnts-new.component';
import { NewEventsTableComponent } from './new-events-table/new-events-table.component';

export const routes: Routes = [
  {
    path: '',
    component: EvntsNewComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'new-events'
      },
      {
        path: 'new-events',
        pathMatch: 'full',
        component: NewEventsTableComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvntsNewRoutingModule {}
