import { RouterModule, Routes } from '@angular/router';
import { NgModule, inject } from '@angular/core';

import { StartPageComponent } from './components/start-page/start-page.component';
import { DeviceInfoResolver, UsersResolver } from './components/guards';
import { canActivateStartPage } from 'src/app/guards';

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
        path: 'op-evnts',
        loadChildren: () =>
          import('../../../features/op-evnts/op-evnts.module').then((m) => m.OpEvntsModule)
      },
      {
        path: 'net-evnts',
        loadChildren: () =>
          import('../../../features/net-evnts/net-evnts.module').then((m) => m.NetEvntsModule)
      },
      {
        path: 'bop-net-evnts',
        loadChildren: () =>
          import('../../../features/net-evnts-bop/net-evnts-bop.module').then(
            (m) => m.NetEvntsBopModule
          )
      },
      {
        path: 'event-tables',
        loadChildren: () =>
          import('../../../features/event-tables/event-tables.module').then(
            (m) => m.EventTablesModule
          )
      },
      {
        path: 'rfts-setup',
        loadChildren: () =>
          import('../../../features/ft-settings/ft-settings.module').then((m) => m.RftsSetupModule)
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
