import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FtSettingsComponent } from './components/ft-settings.component';
import { DummyComponent } from 'src/app/shared/components/dummy/dummy.component';
import { UserAccountsComponent } from './components/user-accounts/user-accounts.component';
import { RolesResolver } from 'src/app/app/pages/start-page/components/guards';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';

export const routes: Routes = [
  {
    path: '',
    component: FtSettingsComponent,
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
