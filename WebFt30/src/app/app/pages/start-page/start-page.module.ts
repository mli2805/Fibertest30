import { NgModule } from '@angular/core';

import { StartPageComponent } from './components/start-page/start-page.component';
import { StartPageSidebarComponent } from './components/start-page-sidebar/start-page-sidebar.component';
import { StartPageHeaderComponent } from './components/start-page-header/start-page-header.component';
import { StartPageRoutingModule } from './start-page-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SystemNotificationsComponent } from './components/notifications/system-notifications/system-notifications.component';
import { AccountMenuComponent } from './components/start-page-header/account-menu/account-menu.component';
import { RouterOtauTitleComponent } from './components/start-page-header/titles/router-otau-title/router-otau-title.component';
import { RouterBaselineTitleComponent } from './components/start-page-header/titles/router-baseline-title/router-baseline-title.component';
import { AlarmNotificationsComponent } from './components/notifications/alarm-notifications/alarm-notifications.component';

@NgModule({
  imports: [StartPageRoutingModule, SharedModule],
  exports: [],
  declarations: [
    StartPageComponent,
    StartPageSidebarComponent,
    StartPageHeaderComponent,
    AlarmNotificationsComponent,
    SystemNotificationsComponent,
    AccountMenuComponent,
    RouterOtauTitleComponent,
    RouterBaselineTitleComponent
  ],
  providers: []
})
export class StartPageModule {}
