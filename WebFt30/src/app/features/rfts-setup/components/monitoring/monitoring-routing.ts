import { RouterModule, Routes } from '@angular/router';
import { NgModule, inject } from '@angular/core';

import { MonitoringPortsComponent } from './components/monitoring-ports/monitoring-ports.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { DummyComponent } from 'src/app/shared/components/dummy/dummy.component';
import { RouterSelectedOtauRedirectComponent } from './monitoring/router-selected-otau-redirect.component';
import { BaselineSetupComponent } from './components/baseline-setup/baseline-setup.component';
import { AlarmProfilesComponent } from './components/alarm-profiles/alarm-profiles.component';

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
        path: 'ports/:ocmPortIndex/dashboard/:monitoringPortId',
        pathMatch: 'full',
        component: BaselineSetupComponent,
        data: {
          navigateToParent: 2
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
        path: 'alarm-profiles',
        component: AlarmProfilesComponent,
        pathMatch: 'full',
        data: {
          navigateToParent: 2
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
