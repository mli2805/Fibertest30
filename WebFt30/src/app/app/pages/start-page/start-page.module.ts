import { NgModule } from '@angular/core';

import { StartPageComponent } from './components/start-page/start-page.component';
import { StartPageSidebarComponent } from './components/start-page-sidebar/start-page-sidebar.component';
import { StartPageHeaderComponent } from './components/start-page-header/start-page-header.component';
import { StartPageRoutingModule } from './start-page-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SystemNotificationsComponent } from './components/notifications/system-notifications/system-notifications.component';
import { AccountMenuComponent } from './components/start-page-header/account-menu/account-menu.component';

@NgModule({
  imports: [StartPageRoutingModule, SharedModule],
  exports: [],
  declarations: [
    StartPageComponent,
    StartPageSidebarComponent,
    StartPageHeaderComponent,
    SystemNotificationsComponent,
    AccountMenuComponent
  ],
  providers: []
})
export class StartPageModule {}
