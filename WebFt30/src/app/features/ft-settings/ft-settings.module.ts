import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@angular/cdk/dialog';

import { RftsSetupRoutingModule } from './ft-settings-routing';
import { FtSettingsComponent } from './components/ft-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserAccountsComponent } from './components/user-accounts/user-accounts.component';
import { UserPlusComponent } from './components/user-accounts/components/user-plus/user-plus.component';
import { UserEditDialogComponent } from './components/user-accounts/components/user-edit-dialog/user-edit-dialog.component';
import { InputByPencilComponent } from '../../shared/components/input-by-pencil/input-by-pencil.component';
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component';
import { EmailNotificationSettingsComponent } from './components/notification-settings/components/email-notification-settings/email-notification-settings.component';
import { InputPasswordWithEyeComponent } from 'src/app/shared/components/input-password-with-eye/input-password-with-eye.component';
import { SnmpNotificationSettingsComponent } from './components/notification-settings/components/snmp-notification-settings/snmp-notification-settings.component';
import { LicensesComponent } from './components/licenses/licenses.component';

@NgModule({
  imports: [RftsSetupRoutingModule, SharedModule, DialogModule, TranslateModule.forChild()],
  declarations: [
    FtSettingsComponent,
    UserAccountsComponent,
    UserPlusComponent,
    UserEditDialogComponent,
    InputByPencilComponent,
    InputPasswordWithEyeComponent,
    LicensesComponent,
    NotificationSettingsComponent,
    EmailNotificationSettingsComponent,
    SnmpNotificationSettingsComponent
  ],
  exports: [],
  providers: []
})
export class RftsSetupModule {}
