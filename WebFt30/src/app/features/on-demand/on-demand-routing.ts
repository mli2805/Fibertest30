import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OnDemandComponent } from './on-demand/on-demand.component';

export const routes: Routes = [
  {
    path: '',
    component: OnDemandComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnDemandRoutingModule {}
