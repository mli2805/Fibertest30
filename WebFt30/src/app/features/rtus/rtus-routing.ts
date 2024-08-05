import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RtuTreeComponent } from './rtu-tree/rtu-tree.component';
import { RtuInformationComponent } from './rtu-information/rtu-information.component';
import { RtuInitializationComponent } from './rtu-initialization/rtu-initialization.component';
import { RtusComponent } from './rtus/rtus.component';

export const routes: Routes = [
  {
    path: '',
    component: RtusComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'rtu-tree'
      },
      {
        path: 'rtu-tree',
        pathMatch: 'full',
        component: RtuTreeComponent
      },
      {
        path: 'information/:id',
        pathMatch: 'full',
        component: RtuInformationComponent
      },
      {
        path: 'initialization/:id',
        pathMatch: 'full',
        component: RtuInitializationComponent,
        data: { navigateToParent: 2 }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RtusRoutingModule {}
