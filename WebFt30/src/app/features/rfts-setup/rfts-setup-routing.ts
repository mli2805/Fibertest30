import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlatformManagementComponent } from './components/platform-management/platform-management.component';
import { DummyComponent } from 'src/app/shared/components/dummy/dummy.component';
import { UserAccountsComponent } from './components/platform-management/user-accounts/user-accounts.component';
import { RolesResolver } from 'src/app/app/pages/start-page/components/guards';
import { NotificationSettingsComponent } from './components/platform-management/notification-settings/notification-settings.component';

export const routes: Routes = [
  {
    path: '',
    component: PlatformManagementComponent
  },
  {
    path: 'platform-management',
    component: PlatformManagementComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'user-accounts'
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RftsSetupRoutingModule {}
