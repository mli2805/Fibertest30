import { RouterModule, Routes } from '@angular/router';
import { NgModule, inject } from '@angular/core';

import { MonitoringPortsComponent } from './components/monitoring-ports/monitoring-ports.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { DummyComponent } from 'src/app/shared/components/dummy/dummy.component';
import { RouterSelectedOtauRedirectComponent } from './monitoring/router-selected-otau-redirect.component';

export const routes: Routes = [
  {
    path: '',
    component: MonitoringComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ports'
      },

      {
        path: 'ports',
        pathMatch: 'full',
        component: RouterSelectedOtauRedirectComponent
      },
      {
        path: 'ports/:ocmPortIndex',
        pathMatch: 'full',
        component: MonitoringPortsComponent,
        data: {
          navigateToParent: 3
        }
      },

      {
        path: 'otau-dashboard',
        component: RouterSelectedOtauRedirectComponent,
        pathMatch: 'full'
      },
      {
        path: 'otau-dashboard/:ocmPortIndex',
        pathMatch: 'full',
        component: DummyComponent,
        data: {
          navigateToParent: 3
        }
      },
      {
        path: 'monitoring-profiles',
        component: DummyComponent,
        pathMatch: 'full',
        data: {
          navigateToParent: 2
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringRoutingModule {}
