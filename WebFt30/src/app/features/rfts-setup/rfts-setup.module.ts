import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@angular/cdk/dialog';

import { RftsSetupRoutingModule } from './rfts-setup-routing';
import { PlatformManagementComponent } from './components/platform-management/platform-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserAccountsComponent } from './components/platform-management/user-accounts/user-accounts.component';
import { UserPlusComponent } from './components/platform-management/user-accounts/components/user-plus/user-plus.component';
import { UserEditDialogComponent } from './components/platform-management/user-accounts/components/user-edit-dialog/user-edit-dialog.component';
import { InputByPencilComponent } from '../../shared/components/input-by-pencil/input-by-pencil.component';
import { NotificationSettingsComponent } from './components/platform-management/notification-settings/notification-settings.component';
import { EmailNotificationSettingsComponent } from './components/platform-management/notification-settings/components/email-notification-settings/email-notification-settings.component';
import { SyslogNotificationSettingsComponent } from './components/platform-management/notification-settings/components/syslog-notification-settings/syslog-notification-settings.component';
import { RelayNotificationSettingsComponent } from './components/platform-management/notification-settings/components/relay-notification-settings/relay-notification-settings.component';
import { PushNotificationSettingsComponent } from './components/platform-management/notification-settings/components/push-notification-settings/push-notification-settings.component';
import { SyslogHostEditDialogComponent } from './components/platform-management/notification-settings/components/syslog-host-edit-dialog/syslog-host-edit-dialog.component';
import { InputPasswordWithEyeComponent } from 'src/app/shared/components/input-password-with-eye/input-password-with-eye.component';
import { SnmpNotificationSettingsComponent } from './components/platform-management/notification-settings/components/snmp-notification-settings/snmp-notification-settings.component';

@NgModule({
  imports: [RftsSetupRoutingModule, SharedModule, DialogModule, TranslateModule.forChild()],
  declarations: [
    PlatformManagementComponent,
    UserAccountsComponent,
    UserPlusComponent,
    UserEditDialogComponent,
    InputByPencilComponent,
    InputPasswordWithEyeComponent,
    NotificationSettingsComponent,
    EmailNotificationSettingsComponent,
    SyslogNotificationSettingsComponent,
    RelayNotificationSettingsComponent,
    PushNotificationSettingsComponent,
    SyslogHostEditDialogComponent,
    SnmpNotificationSettingsComponent
  ],
  exports: [],
  providers: []
})
export class RftsSetupModule {}
