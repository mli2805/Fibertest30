import { RouterModule, Routes } from '@angular/router';
import { NgModule, inject } from '@angular/core';

import { StartPageComponent } from './components/start-page/start-page.component';
import { DeviceInfoResolver, UsersResolver } from './components/guards';
import { canActivateStartPage, canActivateOnDemandPage } from 'src/app/guards';

const routes: Routes = [
  {
    path: '',
    component: StartPageComponent,
    canActivate: [canActivateStartPage],
    resolve: {
      deviceInfo: () => inject(DeviceInfoResolver).resolve(),
      users: () => inject(UsersResolver).resolve()
    },
    children: [
      {
        path: '',
        redirectTo: 'rtus',
        pathMatch: 'full'
      },
      {
        path: 'rtus',
        loadChildren: () => import('../../../features/rtus/rtus.module').then((m) => m.RtusModule)
      },
      {
        path: 'rfts-setup',
        loadChildren: () =>
          import('../../../features/rfts-setup/rfts-setup.module').then((m) => m.RftsSetupModule)
      },
      {
        path: 'on-demand',
        canActivate: [canActivateOnDemandPage],
        loadChildren: () =>
          import('../../../features/on-demand/on-demand.module').then((m) => m.OnDemandModule)
      },
      {
        path: 'reporting',
        loadChildren: () =>
          import('../../../features/reporting/reporting.module').then((m) => m.ReportingModule)
      },
      {
        path: 'gis',
        loadChildren: () => import('../../../features/gis/gis.module').then((m) => m.GisModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartPageRoutingModule {}
