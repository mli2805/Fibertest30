import { RouterModule, Routes } from '@angular/router';
import { NgModule, inject } from '@angular/core';

import { StartPageComponent } from './components/start-page/start-page.component';
import { DeviceInfoResolver, UsersResolver } from './components/guards';
import { canActivateStartPage } from 'src/app/guards';
import { GisComponent } from 'src/app/features/gis/gis/gis.component';

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
        path: 'evnts-new',
        loadChildren: () =>
          import('../../../features/evnts-new/evnts-new.module').then((m) => m.EvntsNewModule)
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
        path: 'sts-evnts',
        loadChildren: () =>
          import('../../../features/sts-evnts/sts-evnts.module').then((m) => m.StsEvntsModule)
      },
      {
        path: 'ft-settings',
        loadChildren: () =>
          import('../../../features/ft-settings/ft-settings.module').then((m) => m.RftsSetupModule)
      },
      {
        path: 'gis',
        component: GisComponent,

        // хотя в gis.module был всего один route при попытке reuse было переполнение callstack
        // loadChildren: () => import('../../../features/gis/gis.module').then((m) => m.GisModule),
        // gis.module всё равно наверное нужен, т.к. там объявлены все дочерние компоненты
        data: {
          reuseRouteId: 'gis'
        }
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../../../features/reporting/reportings.module').then((m) => m.Reporting)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartPageRoutingModule {}
