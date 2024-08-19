import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@angular/cdk/dialog';

import { RftsSetupComponent } from './rfts-setup/rfts-setup.component';
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
import { PlatformCardComponent } from './rfts-setup/platform-card/platform-card/platform-card.component';
import { SnmpNotificationSettingsComponent } from './components/platform-management/notification-settings/components/snmp-notification-settings/snmp-notification-settings.component';
import { NetworkSettingsComponent } from './components/platform-management/system-settings/network-settings/network-settings.component';
import { Ipv4SettingsComponent } from './components/platform-management/system-settings/network-settings/ipv4-settings/ipv4-settings.component';
import { NtpSettingsComponent } from './components/platform-management/system-settings/time-settings/ntp-settings/ntp-settings.component';
import { SystemSettingsComponent } from './components/platform-management/system-settings/system-settings.component';
import { TimeSettingsComponent } from './components/platform-management/system-settings/time-settings/time-settings.component';
import { TimeZoneComponent } from './components/platform-management/system-settings/time-settings/time-zone/time-zone.component';

@NgModule({
  imports: [RftsSetupRoutingModule, SharedModule, DialogModule, TranslateModule.forChild()],
  declarations: [
    RftsSetupComponent,
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
    PlatformCardComponent,
    SnmpNotificationSettingsComponent,
    NetworkSettingsComponent,
    Ipv4SettingsComponent,
    NtpSettingsComponent,
    SystemSettingsComponent,
    TimeSettingsComponent,
    TimeZoneComponent
  ],
  exports: [],
  providers: []
})
export class RftsSetupModule {}
