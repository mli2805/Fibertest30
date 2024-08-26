import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DemoComponent } from './demo/demo.component';
import { DemoComponentsComponent } from './demo-components/demo-components.component';
import { DemoSorViewerComponent } from './sor-viewer/sor-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
    children: [
      {
        path: '',
        redirectTo: 'components',
        pathMatch: 'full'
      },
      {
        path: 'components',
        component: DemoComponentsComponent
      },
      {
        path: 'sor-viewer',
        component: DemoSorViewerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule {}
