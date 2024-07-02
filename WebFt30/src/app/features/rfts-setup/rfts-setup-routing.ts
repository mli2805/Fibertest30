import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RftsSetupComponent } from './rfts-setup/rfts-setup.component';
import { PlatformManagementComponent } from './components/platform-management/platform-management.component';
import { DummyComponent } from 'src/app/shared/components/dummy/dummy.component';
import { UserAccountsComponent } from './components/platform-management/user-accounts/user-accounts.component';
import { RolesResolver } from 'src/app/app/pages/start-page/components/guards';
import { OtauManagementComponent } from './components/platform-management/otau-management/otau-management.component';
import { NotificationSettingsComponent } from './components/platform-management/notification-settings/notification-settings.component';
import { SystemSettingsComponent } from './components/platform-management/system-settings/system-settings.component';

export const routes: Routes = [
  {
    path: '',
    component: RftsSetupComponent
  },
  {
    path: 'platform-management',
    component: PlatformManagementComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'system'
      },
      {
        path: 'system',
        component: SystemSettingsComponent,
        pathMatch: 'full',
        data: {
          navigateToParent: 2
        }
      },
      {
        path: 'user-accounts',
        component: UserAccountsComponent,
        pathMatch: 'full',
        data: {
          navigateToParent: 2
        }
      },
      {
        path: 'notification-settings',
        component: NotificationSettingsComponent,
        pathMatch: 'full',
        data: {
          navigateToParent: 2
        }
      },
      {
        path: 'security-settings',
        component: DummyComponent,
        pathMatch: 'full',
        data: {
          navigateToParent: 2
        }
      },
      {
        path: 'software-management',
        component: DummyComponent,
        pathMatch: 'full',
        data: {
          navigateToParent: 2
        }
      },
      {
        path: 'otau-management',
        component: OtauManagementComponent,
        pathMatch: 'full',
        data: {
          navigateToParent: 2
        }
      }
    ]
  },
  {
    path: 'monitoring',
    loadChildren: () =>
      import('./components/monitoring/monitoring.module').then((m) => m.MonitoringModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RftsSetupRoutingModule {}
